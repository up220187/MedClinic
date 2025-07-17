const express = require('express');
const router = express.Router();
const { getAllAppointments, createAppointment, deleteAppointment, updateAppointment } = require('../controllers/appointmentsController');

router.get('/', getAllAppointments);

router.post('/', createAppointment);

router.delete('/:id', deleteAppointment);

router.put('/:id', updateAppointment);


module.exports = router;