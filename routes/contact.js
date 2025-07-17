const express = require('express');
const router = express.Router();
const { getAllAppointments, createAppointment, deleteAppointment } = require('../controllers/appointmentsController');


router.get('/', getAllAppointments);

router.post('/', createAppointment);

router.delete('/:id', deleteAppointment);

module.exports = router;