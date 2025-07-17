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

const Paciente = require('./models/Paciente');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');


if (Paciente && Doctor && Appointment) {
  Paciente.hasMany(Appointment, { foreignKey: 'pacienteId', as: 'CitasPaciente' });
  Appointment.belongsTo(Paciente, { foreignKey: 'pacienteId' });

  Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'CitasDoctor' });
  Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
  console.log('Asociaciones de modelos definidas.');
} else {
  console.warn("No todos los modelos se cargaron correctamente para definir asociaciones.");
}


const pacientesRoutes = require('./routes/pacientes');
const doctorsRoutes = require('./routes/doctors');
const appointmentsRoutes = require('./routes/appointments');
const contactRoutes = require('./routes/contact');

app.use('/pacientes', pacientesRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/contact', contactRoutes);
app.use(express.static(path.join(__dirname, 'frontend')));

const startServer = async () => {
  await sequelize.sync({ force: true });

  try {
    // CAMBIO IMPORTANTE: Usamos alter: true para no borrar la tabla cada vez
    await sequelize.sync({ alter: true }); 
    console.log('Modelos sincronizados con la base de datos (tablas alteradas si fue necesario).');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
  });
};

startServer();