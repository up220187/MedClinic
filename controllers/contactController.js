const postContacto = (req, res) => {
  // Aquí puedes agregar lógica para guardar el mensaje en una base de datos,
  // enviar un correo electrónico, o cualquier otra cosa.
  // Por ahora, solo lo registra en la consola del servidor y envía una respuesta.
  console.log('Mensaje recibido desde contacto:', req.body);
  res.status(200).json({ status: 'Recibido', message: 'Gracias por tu mensaje.' });
};

module.exports = { postContacto };