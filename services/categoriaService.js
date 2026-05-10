const pool = require('../config/database');

exports.getAllCategorias = async () => {
  const query = `SELECT * FROM categoria`;
  const [rows] = await pool.execute(query);
  return rows;
};

exports.getCategoriaById = async (id) => {
  const query = `SELECT * FROM categoria WHERE id_categoria = ?`;
  const [rows] = await pool.execute(query, [id]);
  if (rows.length === 0) return null;
  return rows[0];
};

exports.createCategoria = async (data) => {
  const { nombre, descripcion, imagen_url } = data;
  const query = `INSERT INTO categoria (nombre, descripcion, imagen_url) VALUES (?, ?, ?)`;
  const [result] = await pool.execute(query, [nombre, descripcion || null, imagen_url || null]);
  
  return { id_categoria: result.insertId, nombre, descripcion, imagen_url };
};

exports.updateCategoria = async (id, data) => {
  const { nombre, descripcion, imagen_url } = data;
  const query = `
    UPDATE categoria 
    SET nombre = COALESCE(?, nombre), 
        descripcion = COALESCE(?, descripcion), 
        imagen_url = COALESCE(?, imagen_url)
    WHERE id_categoria = ?
  `;
  const [result] = await pool.execute(query, [nombre || null, descripcion || null, imagen_url || null, id]);
  return result.affectedRows > 0;
};

exports.deleteCategoria = async (id) => {
  const query = `DELETE FROM categoria WHERE id_categoria = ?`;
  try {
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      const customError = new Error('No se puede eliminar la categoría porque tiene equipos asociados.');
      customError.statusCode = 409;
      throw customError;
    }
    throw error;
  }
};
