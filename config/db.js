// config/db.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); 

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,   
  storage: process.env.DB_STORAGE,   
  logging: false                     
});


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos SQLite establecida exitosamente.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos SQLite:', error);
    process.exit(1); 
  }
};

module.exports = { sequelize, connectDB };