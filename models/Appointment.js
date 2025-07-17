const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  medico: {
    type: DataTypes.STRING,
    allowNull: false
  },
  especialidad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  pacienteId: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  doctorId: {   
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Citas',
  timestamps: true
});


module.exports = Appointment;