const pool = require('../config/database');

exports.getAllEquipos = async (queryFilters) => {
  const { id_categoria, id_proveedor } = queryFilters;
  
  let query = `
    SELECT e.*, c.nombre as categoria, p.nombre as proveedor
    FROM equipo e
    LEFT JOIN categoria c ON e.id_categoria = c.id_categoria
    LEFT JOIN proveedor p ON e.id_proveedor = p.id_proveedor
    WHERE e.estado = 'disponible'
  `;
  
  const params = [];

  if (id_categoria) {
    query += ` AND e.id_categoria = ?`;
    params.push(id_categoria);
  }

  if (id_proveedor) {
    query += ` AND e.id_proveedor = ?`;
    params.push(id_proveedor);
  }

  const [rows] = await pool.execute(query, params);
  return rows;
};

exports.getEquipoById = async (id) => {
  const query = `
    SELECT e.*, c.nombre as categoria, p.nombre as proveedor
    FROM equipo e
    LEFT JOIN categoria c ON e.id_categoria = c.id_categoria
    LEFT JOIN proveedor p ON e.id_proveedor = p.id_proveedor
    WHERE e.id_equipo = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  
  if (rows.length === 0) return null;
  
  // Opcional: Obtener imágenes asociadas
  const imagesQuery = `SELECT * FROM imagen_equipo WHERE id_equipo = ? ORDER BY orden`;
  const [images] = await pool.execute(imagesQuery, [id]);
  
  const equipo = rows[0];
  equipo.imagenes = images;
  
  return equipo;
};

exports.createEquipo = async (data) => {
  const { id_proveedor, id_categoria, nombre, descripcion, precio_por_dia, stock_disponible, estado } = data;
  
  const query = `
    INSERT INTO equipo (id_proveedor, id_categoria, nombre, descripcion, precio_por_dia, stock_disponible, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await pool.execute(query, [
    id_proveedor, 
    id_categoria, 
    nombre, 
    descripcion || null, 
    precio_por_dia, 
    stock_disponible || 1, 
    estado || 'disponible'
  ]);
  
  return { id_equipo: result.insertId, ...data };
};

exports.updateEquipo = async (id, data) => {
  const { id_proveedor, id_categoria, nombre, descripcion, precio_por_dia, stock_disponible, estado } = data;
  
  const query = `
    UPDATE equipo 
    SET id_proveedor = COALESCE(?, id_proveedor),
        id_categoria = COALESCE(?, id_categoria),
        nombre = COALESCE(?, nombre),
        descripcion = COALESCE(?, descripcion),
        precio_por_dia = COALESCE(?, precio_por_dia),
        stock_disponible = COALESCE(?, stock_disponible),
        estado = COALESCE(?, estado)
    WHERE id_equipo = ?
  `;
  
  const [result] = await pool.execute(query, [
    id_proveedor || null, 
    id_categoria || null, 
    nombre || null, 
    descripcion || null, 
    precio_por_dia || null, 
    stock_disponible !== undefined ? stock_disponible : null, 
    estado || null, 
    id
  ]);
  
  return result.affectedRows > 0;
};

exports.deleteEquipo = async (id) => {
  const query = `DELETE FROM equipo WHERE id_equipo = ?`;
  try {
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      const customError = new Error('No se puede eliminar el equipo porque está asociado a reservas u otras entidades.');
      customError.statusCode = 409;
      throw customError;
    }
    throw error;
  }
};
