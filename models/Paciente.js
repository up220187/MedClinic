const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const Paciente = sequelize.define('Paciente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
},
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'Pacientes',
  timestamps: true
});

module.exports = Paciente;