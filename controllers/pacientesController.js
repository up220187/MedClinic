const Paciente = require('../models/Paciente');

const registrarPaciente = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    // Validación básica
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, correo, contraseña).' });
    }

    // Verificar que no exista correo duplicado
    const existe = await Paciente.findOne({ where: { correo } });
    if (existe) {
      return res.status(409).json({ error: 'Ya existe un paciente con ese correo' });
    }

    // En un entorno real, la contraseña DEBERÍA ser hasheada antes de guardar (ej. con bcrypt)
    const paciente = await Paciente.create({ nombre, correo, contraseña });
    res.status(201).json({ paciente, message: 'Paciente registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar paciente:', error);
    res.status(500).json({ error: 'Error en el servidor al registrar paciente' });
  }
};

const loginPaciente = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Faltan credenciales de correo o contraseña.' });
    }

    // En un entorno real, aquí compararías la contraseña hasheada
    const paciente = await Paciente.findOne({ where: { correo, contraseña } });

    if (!paciente) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Puedes devolver un token JWT aquí para una autenticación más robusta
    res.status(200).json({ pacienteId: paciente.id, nombre: paciente.nombre, message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error('Error en login de paciente:', error);
    res.status(500).json({ error: 'Error en login' });
  }
};

module.exports = { registrarPaciente, loginPaciente };