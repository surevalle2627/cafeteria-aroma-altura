const cors = require('cors');

const corsMiddleware = cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

module.exports = corsMiddleware;
