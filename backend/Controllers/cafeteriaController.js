const model = require('../Models/cafeteriaModel');

async function getInicio(req, res, next) {
  try {
    const [config, especialidades] = await Promise.all([
      model.obtenerConfigInicio(),
      model.obtenerEspecialidades(),
    ]);
    res.json({ ok: true, config, especialidades });
  } catch (err) {
    next(err);
  }
}

async function getServicios(req, res, next) {
  try {
    const servicios = await model.obtenerServiciosActivos();
    res.json({ ok: true, servicios });
  } catch (err) {
    next(err);
  }
}

async function getEspecialidades(req, res, next) {
  try {
    const especialidades = await model.obtenerEspecialidades();
    res.json({ ok: true, especialidades });
  } catch (err) {
    next(err);
  }
}

async function getPrecios(req, res, next) {
  try {
    const productos = await model.obtenerProductosDisponibles();
    res.json({ ok: true, productos });
  } catch (err) {
    next(err);
  }
}

async function getNosotros(req, res, next) {
  try {
    const [nosotros, galeria] = await Promise.all([
      model.obtenerNosotros(),
      model.obtenerGaleriaTienda(),
    ]);
    res.json({ ok: true, nosotros, galeria });
  } catch (err) {
    next(err);
  }
}

async function postContacto(req, res, next) {
  try {
    const id = await model.crearContacto(req.body);
    res.status(201).json({
      ok: true,
      id,
      mensaje: 'Tu mensaje ha sido recibido. ¡Gracias por contactar a Aroma & Altura Café!',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getInicio,
  getServicios,
  getEspecialidades,
  getPrecios,
  getNosotros,
  postContacto,
};
