const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/MedClinic';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(' Conectado a MongoDB');
    console.log(' Base de datos activa:', mongoose.connection.name);

  } catch (error) {
    console.error(' Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;