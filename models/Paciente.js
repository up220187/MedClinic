const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Paciente = sequelize.define('Paciente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true // ESTA LÍNEA ES FUNDAMENTAL
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // También es buena práctica
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Pacientes', // Asegura el nombre de la tabla
    timestamps: true
});

module.exports = Paciente;