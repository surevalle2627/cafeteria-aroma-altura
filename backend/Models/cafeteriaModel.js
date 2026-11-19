const { pool } = require('./db');

/**
 * Obtiene la configuración principal de la página de inicio.
 */
async function obtenerConfigInicio() {
  const [rows] = await pool.query('SELECT * FROM config_inicio ORDER BY id ASC LIMIT 1');
  return rows[0] || null;
}

/**
 * Obtiene todos los servicios activos.
 */
async function obtenerServiciosActivos() {
  const [rows] = await pool.query(
    'SELECT * FROM servicios WHERE activo = 1 ORDER BY id ASC'
  );
  return rows;
}

/**
 * Obtiene los productos marcados como especialidad.
 */
async function obtenerEspecialidades() {
  const [rows] = await pool.query(
    'SELECT * FROM productos WHERE es_especialidad = 1 ORDER BY id ASC'
  );
  return rows;
}

/**
 * Obtiene todos los productos disponibles.
 */
async function obtenerProductosDisponibles() {
  const [rows] = await pool.query(
    'SELECT * FROM productos WHERE disponible = 1 ORDER BY categoria ASC, id ASC'
  );
  return rows;
}

/**
 * Obtiene la información institucional de la cafetería.
 */
async function obtenerNosotros() {
  const [rows] = await pool.query('SELECT * FROM nosotros ORDER BY id ASC LIMIT 1');
  return rows[0] || null;
}

/**
 * Obtiene las fotos de la galería ordenadas por su campo orden.
 */
async function obtenerGaleriaTienda() {
  const [rows] = await pool.query(
    'SELECT * FROM galeria_tienda ORDER BY orden ASC, id ASC'
  );
  return rows;
}

/**
 * Inserta un nuevo registro en la tabla contactos.
 */
async function crearContacto({ nombre, email, telefono, asunto, mensaje }) {
  const [result] = await pool.query(
    'INSERT INTO contactos (nombre, email, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, telefono || null, asunto, mensaje]
  );
  return result.insertId;
}

module.exports = {
  obtenerConfigInicio,
  obtenerServiciosActivos,
  obtenerEspecialidades,
  obtenerProductosDisponibles,
  obtenerNosotros,
  obtenerGaleriaTienda,
  crearContacto,
};
