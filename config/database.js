const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Creamos un pool de conexiones reutilizable para alto rendimiento
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 50, // Optimizado para 500 usuarios concurrentes
  queueLimit: 0
});

module.exports = pool;
