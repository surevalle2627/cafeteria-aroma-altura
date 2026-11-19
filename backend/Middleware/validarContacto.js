const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida y normaliza los campos requeridos para POST /api/contactos.
 */
function validarContacto(req, res, next) {
  const body = req.body || {};
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const telefono = typeof body.telefono === 'string' ? body.telefono.trim() : '';
  const asunto = typeof body.asunto === 'string' ? body.asunto.trim() : '';
  const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim() : '';

  const errores = [];
  if (!nombre) errores.push('El campo "nombre" es obligatorio.');
  if (!email || !EMAIL_REGEX.test(email)) errores.push('El campo "email" debe ser un correo válido.');
  if (!asunto) errores.push('El campo "asunto" es obligatorio.');
  if (!mensaje) errores.push('El campo "mensaje" es obligatorio.');

  if (errores.length > 0) {
    return res.status(400).json({
      ok: false,
      error: 'Datos de contacto inválidos.',
      detalles: errores,
    });
  }

  req.body = { nombre, email, telefono, asunto, mensaje };
  next();
}

module.exports = validarContacto;
