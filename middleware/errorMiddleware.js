/**
 * Middleware global para el manejo de errores
 * Estandariza las respuestas de error en toda la API
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Manejo de errores específicos de MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Entrada duplicada en la base de datos.';
  }

  res.status(statusCode).json({
    ok: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
