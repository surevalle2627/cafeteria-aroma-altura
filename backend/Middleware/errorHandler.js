/**
 * Maneja rutas no encontradas (404).
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Manejador global de errores de Express.
 */
function errorHandler(err, req, res, _next) {
  console.error('[Error]', err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    error: status === 500 ? 'Error interno del servidor.' : err.message,
  });
}

module.exports = { notFoundHandler, errorHandler };
