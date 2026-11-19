const model = require('../Models/cafeteriaModel');

const MENSAJE_FALLBACK_OLLAMA =
  'Lo siento, nuestro asistente virtual no está disponible en este momento porque el servicio de IA (Ollama) no está encendido. Por favor, contáctanos por teléfono o mediante el formulario de contacto.';

/**
 * Construye un prompt breve en español con la información real de MySQL.
 */
function construirPrompt({ mensaje, productos, servicios, nosotros }) {
  const listaProductos = productos
    .map((p) => `- ${p.nombre} (${p.categoria}, ${p.tamanio || 'Regular'}): $${p.precio}${p.es_especialidad ? ' [Especialidad]' : ''}`)
    .join('\n');

  const listaServicios = servicios
    .map((s) => `- ${s.nombre} (${s.horario_disponible}): ${s.descripcion}`)
    .join('\n');

  const infoNosotros = nosotros
    ? `${nosotros.nombre_cafeteria} - "${nosotros.eslogan}". Dirección: ${nosotros.direccion}, ${nosotros.ciudad}. Horario: ${nosotros.horario_atencion}. Teléfono: ${nosotros.telefono}. Email: ${nosotros.email}.`
    : 'Aroma & Altura Café.';

  const systemPrompt = [
    'Eres el asistente virtual amable y conciso de la cafetería "Aroma & Altura Café".',
    'Responde siempre en español usando únicamente la siguiente información real del local:',
    `Información general: ${infoNosotros}`,
    `Productos disponibles:\n${listaProductos || 'Sin productos registrados.'}`,
    `Servicios:\n${listaServicios || 'Sin servicios registrados.'}`,
    'Si preguntan algo fuera de esta información, indícalo con amabilidad.',
  ].join('\n\n');

  return `${systemPrompt}\n\nPregunta del cliente: ${mensaje}\nRespuesta:`;
}

/**
 * Controlador de POST /api/chatbot.
 */
async function responderChatbot(req, res, next) {
  const mensaje = typeof req.body?.mensaje === 'string' ? req.body.mensaje.trim() : '';

  if (!mensaje) {
    return res.status(400).json({
      ok: false,
      error: 'El campo "mensaje" es obligatorio.',
    });
  }

  let productos = [];
  let servicios = [];
  let nosotros = null;

  try {
    [productos, servicios, nosotros] = await Promise.all([
      model.obtenerProductosDisponibles(),
      model.obtenerServiciosActivos(),
      model.obtenerNosotros(),
    ]);
  } catch (dbErr) {
    return next(dbErr);
  }

  const prompt = construirPrompt({ mensaje, productos, servicios, nosotros });
  const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'gemma3';

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        prompt,
        stream: false,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`Ollama respondió con estado ${response.status}`);
    }

    const data = await response.json();
    const respuesta = (data.response || '').trim() || MENSAJE_FALLBACK_OLLAMA;
    return res.json({ ok: true, respuesta });
  } catch (ollamaErr) {
    console.warn('[Chatbot] Ollama no disponible:', ollamaErr.message);
    return res.json({ ok: true, respuesta: MENSAJE_FALLBACK_OLLAMA });
  }
}

module.exports = { responderChatbot };
