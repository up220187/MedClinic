const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // <-- ¡Añade las llaves {} aquí!

const Doctor = sequelize.define('Doctor', {
  nombre: DataTypes.STRING,
  correo: DataTypes.STRING,
  contraseña: DataTypes.STRING,
  especialidad: DataTypes.STRING,
  horario: DataTypes.STRING // <-- Asegúrate de que esto esté aquí
});

module.exports = Doctor;