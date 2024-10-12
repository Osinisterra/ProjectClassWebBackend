const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro usuario
const registerUser = async (req, res) => {
  const { email, password, createdBy } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, createdBy, updatedBy: createdBy, isActive: true });
    await newUser.save();
    res.json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error registrando el usuario' });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
    if (!user.isActive) return res.status(403).json({ message: 'Usuario desactivado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id }, 'secreto', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error iniciando sesión' });
  }
};

// Inhabilitar usuario
const deactivateUser = async (req, res) => {
  const { id } = req.params;
  const { updatedBy } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { isActive: false, updatedBy }, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario desactivado correctamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error desactivando el usuario' });
  }
};

module.exports = { registerUser, loginUser, deactivateUser };