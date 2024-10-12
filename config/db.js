const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(mongoUri, {});
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('Error conectando a MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDB;