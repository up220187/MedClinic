const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  especialidad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  horario: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Doctores',
  timestamps: true
});

module.exports = Doctor;