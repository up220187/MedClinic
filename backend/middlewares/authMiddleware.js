const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Obtener token de cookies o headers
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso prohibido' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };