const Appointment = require('../models/Appointment');
const Paciente = require('../models/Paciente'); // Asegúrate de importar Paciente
const Doctor = require('../models/Doctor');     // Asegúrate de importar Doctor

const getAllAppointments = async (req, res) => {
  try {
    const { pacienteId, doctorId } = req.query;
    let whereClause = {};

    if (pacienteId) {
      whereClause.pacienteId = pacienteId;
    }
    if (doctorId) {
      whereClause.doctorId = doctorId;
    }

    const citas = await Appointment.findAll({
      where: whereClause,
      include: [
        { model: Paciente, attributes: ['nombre'] }, // Incluir el nombre del paciente
        { model: Doctor, attributes: ['nombre', 'horario', 'especialidad'] } // Incluir nombre, horario y especialidad del doctor
      ]
    });
    res.json(citas);
  } catch (error) {
    console.error("Error al obtener citas:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener citas." });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { doctorId, fecha, hora } = req.body;

    // 1. Verificar si ya existe una cita para este doctor en esta fecha y hora
    const existingAppointment = await Appointment.findOne({
      where: {
        doctorId: doctorId,
        fecha: fecha,
        hora: hora
      }
    });

    if (existingAppointment) {
      // Si ya hay una cita, devolver un error de conflicto (409)
      return res.status(409).json({ error: 'Ese horario ya está ocupado para este doctor. Por favor, elige otra fecha u hora.' });
    }

    // 2. Si el horario está disponible, crear la nueva cita
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ appointment }); // Devolver la cita creada
  } catch (err) {
    console.error("Error al crear cita:", err);
    res.status(500).json({ error: 'Error al crear cita' });
  }
};

// NUEVA FUNCIÓN: updateAppointment
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params; // ID de la cita a actualizar
    const { doctorId, fecha, hora, pacienteId } = req.body; // Campos a actualizar

    // Opcional: Si quieres validar que el nuevo horario no esté ocupado
    if (doctorId && fecha && hora) {
      const existingAppointment = await Appointment.findOne({
        where: {
          doctorId: doctorId,
          fecha: fecha,
          hora: hora,
          id: { [require('sequelize').Op.ne]: id } // Excluir la propia cita que estamos actualizando
        }
      });

      if (existingAppointment) {
        return res.status(409).json({ error: 'El nuevo horario ya está ocupado para este doctor. Por favor, elige otra fecha u hora.' });
      }
    }

    // Realizar la actualización
    const [updatedRows] = await Appointment.update(req.body, {
      where: { id: id }
    });

    if (updatedRows) {
      // Si se actualizó al menos una fila, obtener la cita actualizada para devolverla
      const updatedAppointment = await Appointment.findByPk(id, {
        include: [
          { model: Paciente, attributes: ['nombre'] },
          { model: Doctor, attributes: ['nombre', 'horario', 'especialidad'] }
        ]
      });
      res.json(updatedAppointment); // Devolver la cita con los datos actualizados
    } else {
      res.status(404).json({ error: 'Cita no encontrada o no hubo cambios para actualizar.' });
    }
  } catch (err) {
    console.error("Error al actualizar cita:", err);
    res.status(500).json({ error: 'Error al actualizar cita' });
  }
};


const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Appointment.destroy({ where: { id } });

    if (deleted) {
      res.json({ message: 'Cita eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Cita no encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
};

module.exports = { getAllAppointments, createAppointment, updateAppointment, deleteAppointment }; // <-- ¡Asegúrate de exportar updateAppointment!