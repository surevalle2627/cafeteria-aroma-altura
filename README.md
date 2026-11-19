# Aroma & Altura Café — Sistema Web Gastronómico & Chatbot IA

Plataforma web integral para cafetería de especialidad artesanal de alta gama, desarrollada con arquitectura desacoplada, consumo 100% dinámico vía API REST y asistente virtual inteligente integrado con Ollama y el modelo Gemma 3.

---

## 🏛️ Arquitectura del Sistema

- **Frontend (SPA - Angular 17 Standalone):** Diseñado bajo estándares UI/UX de lujo (paleta crema `#FAF6F0`, espresso `#1C1410` y cobre `#C88A4B`). Implementa componentes standalone, control de navegación responsiva moderna, Hero con video optimizado para Safari/Chromium, catálogo con filtros interactivos, formulario validado y widget de chatbot flotante global.
- **Backend (Node.js & Express - Patrón MVC):** API REST estructurada en Modelos, Controladores y Middlewares (CORS, validación de inputs y manejo centralizado de errores).
- **Base de Datos (MySQL):** Esquema relacional `cafeteria_db` optimizado con transacciones e índices.
- **Inteligencia Artificial (Ollama + Gemma 3):** Endpoint `/api/chatbot` que inyecta contexto en tiempo real desde MySQL (productos, servicios y datos de contacto) hacia el modelo `gemma3` con respuesta de respaldo ante indisponibilidad.

---

## 📁 Estructura del Proyecto

```text
examenH4progra/
├── backend/
│   ├── Controllers/          # Lógica de controladores (cafeteriaController.js)
│   ├── Middleware/           # CORS, validaciones de contacto, error handler
│   ├── Models/               # Conexión pool MySQL y consultas relacionales
│   ├── chatbot/              # Controlador de integración con Ollama (gemma3)
│   ├── .env.example          # Plantilla de variables de entorno
│   ├── App.js                # Punto de entrada Express y registro de rutas API
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Navbar glassmorphic, Footer, Chatbot flotante, Card especialidad
│   │   │   ├── pages/        # Vistas: Inicio, Servicios, Especialidades, Nosotros, Precios, Contactos
│   │   │   ├── services/     # CafeteriaService (HttpClient)
│   │   │   └── models/       # Interfaces TypeScript del modelo de datos
│   │   ├── styles.css        # Tokens de diseño, KaTeX/Google Fonts y utilidades de accesibilidad
│   │   └── index.html
│   ├── public/videos/        # Copia de seguridad local del video de cafetería
│   ├── angular.json
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🗄️ Esquema de Base de Datos (`cafeteria_db`)

El sistema utiliza 6 tablas relacionales:

1. **`config_inicio`:** Configuración dinámica del Hero principal (`titulo_hero`, `subtitulo`, `descripcion`, `video_pexels_url`, `texto_boton`, `ruta_boton`).
2. **`servicios`:** Lista de experiencias y servicios activos (`nombre`, `descripcion`, `icono`, `imagen_url`, `horario_disponible`, `activo`).
3. **`productos`:** Carta completa con diferenciador de especialidades (`nombre`, `categoria`, `descripcion`, `precio`, `tamanio`, `es_especialidad`, `notas_cata`, `imagen_url`, `disponible`).
4. **`nosotros`:** Información institucional y de contacto (`nombre_cafeteria`, `eslogan`, `historia`, `mision`, `vision`, `direccion`, `ciudad`, `telefono`, `email`, `horario_atencion`, `mapa_url`).
5. **`galeria_tienda`:** Registro de fotos y descripciones de los espacios (`titulo`, `descripcion`, `imagen_url`, `orden`).
6. **`contactos`:** Almacenamiento seguro de mensajes y reservas enviadas por los clientes (`nombre`, `email`, `telefono`, `asunto`, `mensaje`, `creado_en`).

---

## 🚀 Instalación y Puesta en Marcha

### 1. Requisitos Previos
- Node.js 18+ y npm
- MySQL Server en ejecución con la base `cafeteria_db` creada e importada
- (Opcional para IA local) Ollama con el modelo instalado:
  ```bash
  ollama run gemma3
  ```

### 2. Configurar y Ejecutar el Backend
```bash
cd backend
npm install
cp .env.example .env   # Ajusta las credenciales de tu MySQL si es necesario
npm start
```
*El servidor iniciará en `http://localhost:3000`.*

### 3. Ejecutar el Frontend
En otra terminal:
```bash
cd frontend
npm install
npm start
```
*La aplicación Angular se abrirá en `http://localhost:4200`.*

### 4. Compilación de Producción
```bash
cd frontend
npm run build
```
Genera los artefactos optimizados en `frontend/dist/frontend`.
