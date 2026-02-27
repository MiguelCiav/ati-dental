const User = require('../models/User');

// Actualizar el idioma del perfil
const updateProfileLanguage = async (req, res) => {
    try {
        const { language } = req.body;
        const userId = req.user.userId;

        if (!language) {
            return res.status(400).json({
                success: false,
                message: 'El idioma es requerido'
            });
        }

        const validLanguages = ['es', 'en']; // Se pueden agregar más idiomas si es necesario
        if (!validLanguages.includes(language)) {
            return res.status(400).json({
                success: false,
                message: 'Idioma no válido'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        user.language = language;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Idioma actualizado correctamente',
            data: {
                language: user.language
            }
        });

    } catch (error) {
        console.error('Error al actualizar idioma:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    updateProfileLanguage
};
