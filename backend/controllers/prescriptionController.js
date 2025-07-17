const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

exports.createPrescription = async (req, res) => {
  try {
    const { patientId, medication, instructions, diagnosis, appointmentId } = req.body;
    
    // Verificar que el paciente existe
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    // Verificar cita si se proporciona
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: 'Cita no encontrada' });
      }
    }

    const newPrescription = new Prescription({
      patient: patientId,
      doctor: req.user.id,
      medication,
      instructions,
      diagnosis,
      appointment: appointmentId || null
    });

    await newPrescription.save();
    
    res.status(201).json({
      message: 'Receta creada exitosamente',
      prescription: newPrescription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate('doctor', 'firstName lastName specialty')
      .sort({ date: -1 });
    
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePrescriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const prescription = await Prescription.findOneAndUpdate(
      { _id: id, doctor: req.user.id },
      { isActive },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};