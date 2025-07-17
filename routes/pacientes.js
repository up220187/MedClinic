const express = require('express');
const router = express.Router();
const { registrarPaciente, loginPaciente } = require('../controllers/pacientesController');


router.post('/', registrarPaciente);

router.post('/login', loginPaciente);

module.exports = router;