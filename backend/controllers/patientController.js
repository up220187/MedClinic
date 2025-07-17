const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const User = require('../models/User');

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'firstName lastName specialty')
      .sort({ date: -1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, reason } = req.body;
    
    // Verificar que el doctor existe
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    const newAppointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date,
      reason,
      status: 'pending'
    });

    await newAppointment.save();
    
    res.status(201).json({
      message: 'Cita creada exitosamente',
      appointment: newAppointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMedicalHistory = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate('doctor', 'firstName lastName specialty')
      .sort({ date: -1 });
    
    const appointments = await Appointment.find({ 
      patient: req.user.id,
      status: 'completed' 
    }).populate('doctor', 'firstName lastName');
    
    res.json({
      prescriptions,
      appointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }
    
    // Aquí procesarías el archivo subido (req.file)
    // Guardar referencia en la base de datos, etc.
    
    res.json({ 
      message: 'Documento subido exitosamente',
      filePath: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};