const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  createDoctor,
  loginDoctor,
  obtenerCitasDeDoctor
} = require('../controllers/doctorsController');


router.get('/', getAllDoctors);

router.post('/', createDoctor);

router.post('/login', loginDoctor);

router.get('/:id/citas', obtenerCitasDeDoctor);

module.exports = router;