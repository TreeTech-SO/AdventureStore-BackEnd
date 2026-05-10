const jwt = require('jsonwebtoken');
const pool = require('../config/database');

/**
 * Middleware para proteger rutas, verifica el token JWT
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      ok: false,
      error: 'No has iniciado sesión. Por favor inicia sesión para acceder.'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Bug #5: validación defensiva — evitar fallos silenciosos si el payload cambia
    if (!decoded.id) {
      return res.status(401).json({
        ok: false,
        error: 'Token con formato inválido.'
      });
    }

    // Buscar usuario en BD para asegurarnos que exista y esté activo
    const query = `SELECT id_usuario, nombre, apellido, email, tipo_usuario, estado FROM usuario WHERE id_usuario = ?`;
    const [rows] = await pool.execute(query, [decoded.id]);
    
    if (rows.length === 0 || rows[0].estado !== 'activo') {
      return res.status(401).json({
        ok: false,
        error: 'El usuario al que pertenece este token ya no existe o está inactivo.'
      });
    }

    // Bug #1: normalizar req.user para que SIEMPRE tenga .id (alias de id_usuario)
    req.user = {
      ...rows[0],
      id: rows[0].id_usuario
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        error: 'Token expirado. Por favor inicia sesión nuevamente.'
      });
    }
    return res.status(401).json({
      ok: false,
      error: 'Token inválido o expirado. Por favor inicia sesión nuevamente.'
    });
  }
};

/**
 * Middleware para autorizar roles específicos
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Verificamos el rol del usuario que ya ha sido adjuntado a la request
    if (!roles.includes(req.user.tipo_usuario)) {
      return res.status(403).json({
        ok: false,
        error: 'No tienes permiso para realizar esta acción.'
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
