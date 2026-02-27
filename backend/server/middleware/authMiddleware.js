const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Obtener el header de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado: Token no proporcionado o formato inválido'
        });
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adjuntar la información del usuario al request
        req.user = decoded;

        // Continuar al siguiente middleware/controlador
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado: El token ha expirado'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Acceso denegado: Token inválido'
        });
    }
};

module.exports = authMiddleware;
