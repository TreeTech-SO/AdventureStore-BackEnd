/**
 * Envoltorio para manejar errores en funciones asíncronas
 * Evita tener que usar bloques try-catch en cada controlador
 */
module.exports = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
