const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Importar controladores
const authController = require('../controllers/authController');
const doctorController = require('../controllers/doctorController');
const patientController = require('../controllers/patientController');

// Rutas de autenticación
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authMiddleware, authController.logout);
router.get('/auth/me', authMiddleware, authController.getProfile);

// Rutas para doctores
router.get('/doctor/schedule', authMiddleware, roleMiddleware(['doctor']), doctorController.getSchedule);
router.patch('/doctor/appointments/:id', authMiddleware, roleMiddleware(['doctor']), doctorController.updateAppointmentStatus);

// Rutas para pacientes
router.get('/patient/appointments', authMiddleware, roleMiddleware(['patient']), patientController.getAppointments);
router.post('/patient/appointments', authMiddleware, roleMiddleware(['patient']), patientController.createAppointment);


// ... (imports previos)
const prescriptionController = require('../controllers/prescriptionController');

// ... (rutas existentes)

// Rutas para recetas
router.post('/prescriptions', 
  authMiddleware, 
  roleMiddleware(['doctor']), 
  prescriptionController.createPrescription
);

router.get('/patient/prescriptions', 
  authMiddleware, 
  roleMiddleware(['patient']), 
  prescriptionController.getPatientPrescriptions
);

router.patch('/prescriptions/:id/status', 
  authMiddleware, 
  roleMiddleware(['doctor']), 
  prescriptionController.updatePrescriptionStatus
);

// ... (export)
module.exports = router;