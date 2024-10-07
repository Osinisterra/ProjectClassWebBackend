const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());  // Para poder manejar JSON en las peticiones

// URL de conexión a MongoDB Atlas (Asegúrate de reemplazar <db_password> con tu contraseña real)
const dbPassword = 'WFisTYItWBj06i44';
const mongoUri = `mongodb+srv://mongodb:${dbPassword}@cluster0.09zow.mongodb.net/DBProjectUSCClassWeb?retryWrites=true&w=majority&appName=Cluster0`;

// Conectar a MongoDB Atlas
mongoose.connect(mongoUri, {}).then(() => {
  console.log('Conectado a MongoDB Atlas');
}).catch(err => {
  console.error('Error conectando a MongoDB Atlas', err);
});

// Esquema de la colección "usuarios"
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true }); // Activa automáticamente `createdAt` y `updatedAt`

// Middleware para actualizar el campo `updatedAt` antes de cada modificación
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

// Ruta para registrar un usuario
app.post('/register', async (req, res) => {
  const { email, password, createdBy } = req.body;

  try {
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      createdBy,
      updatedBy: createdBy,  // Al crear, el mismo usuario será tanto `createdBy` como `updatedBy`
      isActive: true
    });

    await newUser.save();
    res.json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registrando el usuario' });
  }
});

// Ruta para iniciar sesión (login)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Buscar el usuario por email
      const user = await User.findOne({ email });
  
      // Verificar si el usuario existe
      if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }
  
      // Verificar si el usuario está activo
      if (!user.isActive) {
        return res.status(403).json({ message: 'Usuario desactivado. No puede iniciar sesión.' });
      }
  
      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }
  
      // Generar un token JWT si el login es exitoso
      const token = jwt.sign({ id: user._id }, 'secreto', { expiresIn: '1h' });
      res.json({ message: 'Login exitoso', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error iniciando sesión' });
    }
  });
  

// Ruta para desactivar (deshabilitar) un usuario
app.put('/deactivate/:id', async (req, res) => {
  const { id } = req.params;
  const { updatedBy } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { isActive: false, updatedBy }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario desactivado correctamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error desactivando el usuario' });
  }
});

// Servidor escuchando en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
