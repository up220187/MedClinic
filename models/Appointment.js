const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // <-- ¡Añade las llaves {} aquí!
const Doctor = require('./Doctor');
const Paciente = require('./Paciente');

const Appointment = sequelize.define('Appointment', {
  medico: DataTypes.STRING,
  especialidad: DataTypes.STRING,
  fecha: DataTypes.DATEONLY,
  hora: DataTypes.STRING, // <-- Asegúrate de que esto esté aquí
  pacienteId: DataTypes.INTEGER,
  doctorId: DataTypes.INTEGER
});

// Asociaciones
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
Appointment.belongsTo(Paciente, { foreignKey: 'pacienteId' });

module.exports = Appointment;