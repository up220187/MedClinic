const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.getSchedule = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'firstName lastName')
      .sort({ date: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, doctor: req.user.id },
      { status },
      { new: true }
    ).populate('patient', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ...otros métodos para doctor