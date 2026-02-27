const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Función de login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionaron email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar al usuario por su email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Si no existe el usuario, responder con error 401
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Comparar la contraseña recibida con el hash guardado
    const isPasswordValid = await user.comparePassword(password);

    // Si la contraseña no coincide, responder con error 401
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar el payload del token
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    // Generar el JWT firmado
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Responder con código 200 y el token
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          role: user.role,
          displayId: user.displayId
        }
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  login
};
