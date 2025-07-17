const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor'); // Asegúrate de importar Doctor y Paciente si los necesitas para `include`
const Paciente = require('../models/Paciente');

const getAllAppointments = async (req, res) => {
  try {
    // Puedes agregar filtros si el frontend los envía (ej. por pacienteId)
    const whereClause = {};
    if (req.query.pacienteId) {
      whereClause.pacienteId = req.query.pacienteId;
    }
    if (req.query.doctorId) {
      whereClause.doctorId = req.query.doctorId;
    }

    const citas = await Appointment.findAll({
      where: whereClause,
      include: [
        { model: Doctor, attributes: ['nombre', 'especialidad'] }, // Incluir datos del doctor
        { model: Paciente, attributes: ['nombre', 'correo'] }    // Incluir datos del paciente
      ]
    });
    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { medico, especialidad, fecha, pacienteId, doctorId } = req.body;

    if (!medico || !especialidad || !fecha || !pacienteId || !doctorId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para la cita.' });
    }

    const appointment = await Appointment.create({
      medico,
      especialidad,
      fecha,
      pacienteId,
      doctorId
    });
    res.status(201).json({ appointment, message: 'Cita agendada correctamente' });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ error: 'Error al agendar la cita' });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID de cita no proporcionado.' });
    }

    const deleted = await Appointment.destroy({ where: { id } });

    if (deleted) {
      res.json({ message: 'Cita eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Cita no encontrada' });
    }
  } catch (err) {
    console.error('Error al eliminar cita:', err);
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
};

module.exports = { getAllAppointments, createAppointment, deleteAppointment };