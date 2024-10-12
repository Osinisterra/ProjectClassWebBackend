const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbPassword = 'WFisTYItWBj06i44';
    const mongoUri = `mongodb+srv://mongodb:${dbPassword}@cluster0.09zow.mongodb.net/DBProjectUSCClassWeb?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(mongoUri, {});
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('Error conectando a MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDB;