require('dotenv').config();
const express = require('express');
const { verificarConexion } = require('./Models/db');
const corsMiddleware = require('./Middleware/corsMiddleware');
const validarContacto = require('./Middleware/validarContacto');
const { notFoundHandler, errorHandler } = require('./Middleware/errorHandler');
const cafeteriaController = require('./Controllers/cafeteriaController');
const { responderChatbot } = require('./chatbot/chatbotController');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(corsMiddleware);
app.use(express.json());

app.get('/api/inicio', cafeteriaController.getInicio);
app.get('/api/servicios', cafeteriaController.getServicios);
app.get('/api/especialidades', cafeteriaController.getEspecialidades);
app.get('/api/precios', cafeteriaController.getPrecios);
app.get('/api/nosotros', cafeteriaController.getNosotros);
app.post('/api/contactos', validarContacto, cafeteriaController.postContacto);
app.post('/api/chatbot', responderChatbot);

app.use(notFoundHandler);
app.use(errorHandler);

async function iniciarServidor() {
  try {
    await verificarConexion();
    console.log('Conexión a MySQL (cafeteria_db) establecida correctamente.');
    app.listen(PORT, () => {
      console.log(`Servidor de Aroma & Altura Café escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('No se pudo conectar a MySQL:', err.message);
    process.exit(1);
  }
}

iniciarServidor();
