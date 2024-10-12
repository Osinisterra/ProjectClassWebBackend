const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// Conectar a la base de datos
connectDB();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Usar las rutas
app.use('/api/users', userRoutes);

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
