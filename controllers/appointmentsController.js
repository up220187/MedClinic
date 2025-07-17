const Appointment = require('../models/Appointment');
const Paciente = require('../models/Paciente'); // ¡Importante! Asegúrate de importar el modelo Paciente

const getAllAppointments = async (req, res) => {
  try {
    const { pacienteId } = req.query; // Obtener pacienteId de los parámetros de la URL
    let whereClause = {};

    if (pacienteId) {
      whereClause.pacienteId = pacienteId; // Aplicar filtro si pacienteId está presente
    }

    const citas = await Appointment.findAll({
      where: whereClause,
      include: [{
        model: Paciente, // Incluir el modelo Paciente
        attributes: ['nombre'] // Solo obtener el nombre del paciente
      }]
    });
    res.json(citas);
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener citas." });
  }
};

const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    // Después de crear, también queremos incluir la información del paciente para la respuesta
    const createdAppointment = await Appointment.findByPk(appointment.id, {
      include: [{
        model: Paciente,
        attributes: ['nombre']
      }]
    });
    res.status(201).json({ appointment: createdAppointment });
  } catch (error) {
    console.error("Error al crear la cita:", error);
    res.status(500).json({ error: "Error al crear la cita." });
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

const updateAppointment = (req, res) => {
  const id = parseInt(req.params.id);
  const { fecha, doctorId, pacienteId } = req.body;

  // Leer base de datos
  const db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

  const index = db.appointments.findIndex((cita) => cita.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }

  // Actualizar campos
  if (fecha) db.appointments[index].fecha = fecha;
  if (doctorId) db.appointments[index].doctorId = doctorId;
  if (pacienteId) db.appointments[index].pacienteId = pacienteId;

  // Guardar cambios
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

  res.json(db.appointments[index]);
};

module.exports = { getAllAppointments, createAppointment, deleteAppointment, updateAppointment };