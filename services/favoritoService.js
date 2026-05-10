const pool = require('../config/database');

exports.addFavorito = async (userId, equipoId) => {
  // Protección defensiva: mysql2 lanza error si recibe undefined en lugar de null
  const safeUserId = Number(userId);
  const safeEquipoId = Number(equipoId);

  if (!safeUserId || !safeEquipoId || isNaN(safeUserId) || isNaN(safeEquipoId)) {
    const err = new Error('id_usuario o id_equipo inválidos');
    err.statusCode = 400;
    throw err;
  }

  const query = `INSERT INTO favorito (id_usuario, id_equipo) VALUES (?, ?)`;
  try {
    const [result] = await pool.execute(query, [safeUserId, safeEquipoId]);
    return { id_favorito: result.insertId, id_usuario: safeUserId, id_equipo: safeEquipoId };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const customError = new Error('El equipo ya está en tus favoritos.');
      customError.statusCode = 409;
      throw customError;
    }
    throw error;
  }
};

exports.removeFavorito = async (equipoId, userId) => {
  const query = `DELETE FROM favorito WHERE id_equipo = ? AND id_usuario = ?`;
  const [result] = await pool.execute(query, [equipoId, userId]);
  return result.affectedRows > 0;
};

exports.getFavoritosByUsuario = async (userId) => {
  const query = `
    SELECT f.id_favorito, f.fecha_agregado, e.*
    FROM favorito f
    JOIN equipo e ON f.id_equipo = e.id_equipo
    WHERE f.id_usuario = ?
    ORDER BY f.fecha_agregado DESC
  `;
  const [rows] = await pool.execute(query, [userId]);
  return rows;
};
