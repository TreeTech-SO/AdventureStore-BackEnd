const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signToken = (id, tipo_usuario) => {
  return jwt.sign({ id, tipo_usuario }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

exports.registerUser = async (userData) => {
  const { nombre, apellido, email, contrasena, telefono, tipo_usuario } = userData;

  // Hashear contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(contrasena, salt);

  const query = `
    INSERT INTO usuario (nombre, apellido, email, contrasena, telefono, tipo_usuario)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  // Asignamos 'cliente' por defecto si no se pasa tipo_usuario
  const params = [nombre, apellido, email, hashedPassword, telefono || null, tipo_usuario || 'cliente'];

  const [result] = await pool.execute(query, params);
  
  return {
    id_usuario: result.insertId,
    nombre,
    apellido,
    email,
    tipo_usuario: tipo_usuario || 'cliente'
  };
};

exports.loginUser = async (email, contrasena) => {
  const query = `SELECT * FROM usuario WHERE email = ? AND estado = 'activo'`;
  const [rows] = await pool.execute(query, [email]);

  if (rows.length === 0) {
    const error = new Error('Email o contraseña incorrectos, o usuario inactivo');
    error.statusCode = 401;
    throw error;
  }

  const user = rows[0];

  const isPasswordCorrect = await bcrypt.compare(contrasena, user.contrasena);

  if (!isPasswordCorrect) {
    const error = new Error('Email o contraseña incorrectos');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user.id_usuario, user.tipo_usuario);

  return {
    user: {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      tipo_usuario: user.tipo_usuario
    },
    token
  };
};
