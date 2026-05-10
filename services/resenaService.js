const pool = require('../config/database');

exports.createResena = async (userId, data) => {
  const { id_equipo, calificacion, comentario } = data;
  
  const query = `
    INSERT INTO resena (id_usuario, id_equipo, calificacion, comentario)
    VALUES (?, ?, ?, ?)
  `;
  try {
    const [result] = await pool.execute(query, [userId, id_equipo, calificacion, comentario || null]);
    return { id_resena: result.insertId, id_usuario: userId, id_equipo, calificacion, comentario };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const customError = new Error('Ya has calificado este equipo.');
      customError.statusCode = 409;
      throw customError;
    }
    throw error;
  }
};

exports.getResenasByEquipo = async (equipoId) => {
  const query = `
    SELECT r.id_resena, r.calificacion, r.comentario, r.fecha_resena, u.nombre, u.apellido
    FROM resena r
    JOIN usuario u ON r.id_usuario = u.id_usuario
    WHERE r.id_equipo = ?
    ORDER BY r.fecha_resena DESC
  `;
  const [rows] = await pool.execute(query, [equipoId]);
  return rows;
};
