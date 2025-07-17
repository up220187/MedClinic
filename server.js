const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const { connectDB, sequelize } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Importación de modelos: Asegúrate de que en cada uno de estos archivos de modelo,
// 'sequelize' se importa como: const { sequelize } = require('../config/db');
const Paciente = require('./models/Paciente');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');


if (Paciente && Doctor && Appointment) {
  // Definición de asociaciones con onDelete: 'CASCADE'
  // Esto asegura que, si un paciente o doctor se elimina, sus citas asociadas también se eliminen.
  Paciente.hasMany(Appointment, { foreignKey: 'pacienteId', as: 'CitasPaciente', onDelete: 'CASCADE' });
  Appointment.belongsTo(Paciente, { foreignKey: 'pacienteId' });

  Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'CitasDoctor', onDelete: 'CASCADE' });
  Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
  console.log('Asociaciones de modelos definidas.');
} else {
  console.warn("No todos los modelos se cargaron correctamente para definir asociaciones.");
}


// Rutas de la API
const pacientesRoutes = require('./routes/pacientes');
const doctorsRoutes = require('./routes/doctors');
const appointmentsRoutes = require('./routes/appointments');
const contactRoutes = require('./routes/contact');

app.use('/pacientes', pacientesRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/contact', contactRoutes);

// Asegúrate de que esta línea de static files esté solo una vez
// app.use(express.static(path.join(__dirname, 'frontend')));


const startServer = async () => {
  // Conecta a la base de datos primero
  await connectDB();

  try {
    // Sincroniza los modelos con la base de datos.
    // 'alter: true' intenta modificar las tablas existentes sin borrar datos.
    // Solo si el archivo de la base de datos (ej. medclinic.sqlite) es nuevo/vacío,
    // creará las tablas desde cero. Si existen datos inconsistentes (como IDs duplicados),
    // aún podría dar errores si no se borra la base de datos antes.
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos (tablas alteradas si fue necesario).');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
    // Para entornos de desarrollo, si el error persiste, la causa más probable
    // sigue siendo un archivo de base de datos SQLite corrupto o con datos inconsistentes.
    // Considera eliminar el archivo 'medclinic.sqlite' manualmente y reiniciar.
    process.exit(1);
  }

  // Inicia el servidor Express
  app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
  });
};

startServer();