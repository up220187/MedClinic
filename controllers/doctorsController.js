const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Paciente = require('../models/Paciente');

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      attributes: ['id', 'nombre', 'especialidad', 'horario'] // No mandamos correo ni contraseña por seguridad
    });
    res.json(doctors);
  } catch (err) {
    console.error('Error al obtener los doctores:', err);
    res.status(500).json({ error: 'Error al obtener los doctores' });
  }
};

// Registro de doctor
const createDoctor = async (req, res) => {
  try {
    const { nombre, correo, contraseña, especialidad, horario } = req.body;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, correo, contraseña).' });
    }

    const yaExiste = await Doctor.findOne({ where: { correo } });
    if (yaExiste) {
      return res.status(409).json({ error: 'Ya hay un doctor registrado con ese correo' });
    }

    // En un entorno real, la contraseña DEBERÍA ser hasheada antes de guardar (ej. bcrypt)
    const doctor = await Doctor.create({ nombre, correo, contraseña, especialidad, horario });
    res.status(201).json({ doctor, message: 'Doctor registrado exitosamente' });
  } catch (err) {
    console.error("Error al crear doctor:", err.message);
    res.status(500).json({ error: 'Error al registrar doctor' });
  }
};

// Login de doctor
const loginDoctor = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Faltan credenciales de correo o contraseña.' });
    }

    // En un entorno real, aquí compararías la contraseña hasheada
    const doctor = await Doctor.findOne({ where: { correo, contraseña } });

    if (!doctor) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Puedes devolver un token JWT aquí para una autenticación más robusta
    res.status(200).json({ doctorId: doctor.id, nombre: doctor.nombre, message: 'Inicio de sesión exitoso' });
  } catch (err) {
    console.error('Error al iniciar sesión de doctor:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Ver pacientes con citas agendadas para un doctor específico
const obtenerCitasDeDoctor = async (req, res) => {
  try {
    const { id } = req.params; // ID del doctor
    if (!id) {
      return res.status(400).json({ error: 'ID de doctor no proporcionado.' });
    }

    const citas = await Appointment.findAll({
      where: { doctorId: id },
      include: [
        { model: Paciente, attributes: ['id', 'nombre', 'correo'] }, // Incluye solo los atributos necesarios del paciente
        { model: Doctor, attributes: ['nombre', 'especialidad'] } // Opcional: incluir datos del doctor de la cita (aunque ya sabemos su ID)
      ]
    });
    res.json(citas);
  } catch (err) {
    console.error('Error al obtener citas del doctor:', err);
    res.status(500).json({ error: 'Error al obtener citas del doctor' });
  }
};

module.exports = {
  getAllDoctors,
  createDoctor,
  loginDoctor,
  obtenerCitasDeDoctor
};