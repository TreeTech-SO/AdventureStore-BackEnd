require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const equipoRoutes = require('./routes/equipoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
const resenaRoutes = require('./routes/resenaRoutes');

// Importar middleware de errores globales
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Configuración CORS para el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Cambiar por el dominio de React en producción
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares para procesar JSON y datos codificados en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/favoritos', favoritoRoutes);
app.use('/api/resenas', resenaRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('API REST de AdventureStore en funcionamiento');
});

// Manejo de rutas no encontradas (404)
app.all('*', (req, res, next) => {
  const err = new Error(`No se puede encontrar la ruta ${req.originalUrl} en este servidor`);
  err.statusCode = 404;
  next(err);
});

// Middleware global de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
