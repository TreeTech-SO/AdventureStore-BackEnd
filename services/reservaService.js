const pool = require('../config/database');

exports.createReserva = async (userId, data) => {
  const { id_sede, fecha_inicio, fecha_fin, detalles } = data;
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    let total = 0;

    // Verificar disponibilidad y calcular subtotal
    for (const item of detalles) {
      const [equipos] = await connection.execute(
        `SELECT precio_por_dia, stock_disponible FROM equipo WHERE id_equipo = ? FOR UPDATE`,
        [item.id_equipo]
      );

      if (equipos.length === 0) {
        throw new Error(`El equipo con ID ${item.id_equipo} no existe.`);
      }

      const equipo = equipos[0];

      if (equipo.stock_disponible < item.cantidad) {
        throw new Error(`Stock insuficiente para el equipo con ID ${item.id_equipo}. Stock disponible: ${equipo.stock_disponible}`);
      }

      // Descontar stock inmediatamente
      await connection.execute(
        `UPDATE equipo SET stock_disponible = stock_disponible - ? WHERE id_equipo = ?`,
        [item.cantidad, item.id_equipo]
      );

      // Calcular cantidad de días
      const inicio = new Date(fecha_inicio);
      const fin = new Date(fecha_fin);
      const diffTime = Math.abs(fin - inicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      const diasReserva = diffDays > 0 ? diffDays : 1;

      item.precio_unitario = equipo.precio_por_dia;
      item.subtotal = equipo.precio_por_dia * item.cantidad * diasReserva;
      
      total += item.subtotal;
    }

    // Insertar reserva
    const [reservaResult] = await connection.execute(
      `INSERT INTO reserva (id_usuario, id_sede, fecha_inicio, fecha_fin, total) VALUES (?, ?, ?, ?, ?)`,
      [userId, id_sede, fecha_inicio, fecha_fin, total]
    );

    const id_reserva = reservaResult.insertId;

    // Insertar detalles
    for (const item of detalles) {
      await connection.execute(
        `INSERT INTO detalle_reserva (id_reserva, id_equipo, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)`,
        [id_reserva, item.id_equipo, item.cantidad, item.precio_unitario, item.subtotal]
      );
    }

    await connection.commit();
    return { id_reserva, id_usuario: userId, id_sede, fecha_inicio, fecha_fin, total, detalles };

  } catch (error) {
    await connection.rollback();
    error.statusCode = error.statusCode || 400;
    throw error;
  } finally {
    connection.release();
  }
};

exports.getReservasUsuario = async (userId) => {
  const query = `
    SELECT r.*, s.nombre_sede
    FROM reserva r
    JOIN sede s ON r.id_sede = s.id_sede
    WHERE r.id_usuario = ?
    ORDER BY r.fecha_reserva DESC
  `;
  const [rows] = await pool.execute(query, [userId]);
  return rows;
};

exports.getReservaById = async (reservaId, userId) => {
  const query = `
    SELECT r.*, s.nombre_sede, s.direccion
    FROM reserva r
    JOIN sede s ON r.id_sede = s.id_sede
    WHERE r.id_reserva = ? AND r.id_usuario = ?
  `;
  const [reservas] = await pool.execute(query, [reservaId, userId]);

  if (reservas.length === 0) return null;

  const reserva = reservas[0];

  const detallesQuery = `
    SELECT dr.*, e.nombre as equipo_nombre
    FROM detalle_reserva dr
    JOIN equipo e ON dr.id_equipo = e.id_equipo
    WHERE dr.id_reserva = ?
  `;
  const [detalles] = await pool.execute(detallesQuery, [reservaId]);

  reserva.detalles = detalles;
  return reserva;
};

exports.updateEstadoReserva = async (reservaId, userId, estado) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Buscar la reserva
    const [reservas] = await connection.execute(
      `SELECT * FROM reserva WHERE id_reserva = ? AND id_usuario = ? FOR UPDATE`,
      [reservaId, userId]
    );

    if (reservas.length === 0) {
      await connection.rollback();
      return null;
    }

    const reserva = reservas[0];

    // Si se cancela y no estaba ya cancelada, retornar el stock
    if (estado === 'cancelada' && reserva.estado !== 'cancelada') {
      const [detalles] = await connection.execute(
        `SELECT id_equipo, cantidad FROM detalle_reserva WHERE id_reserva = ?`,
        [reservaId]
      );

      for (const item of detalles) {
        await connection.execute(
          `UPDATE equipo SET stock_disponible = stock_disponible + ? WHERE id_equipo = ?`,
          [item.cantidad, item.id_equipo]
        );
      }
    }

    // Actualizar el estado
    await connection.execute(
      `UPDATE reserva SET estado = ? WHERE id_reserva = ?`,
      [estado, reservaId]
    );

    await connection.commit();
    reserva.estado = estado;
    return reserva;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
