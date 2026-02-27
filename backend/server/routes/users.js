const express = require('express');
const router = express.Router();
const { updateProfileLanguage } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * PATCH /api/users/profile
 * Actualizar el idioma del usuario autenticado
 * Body: { language }
 */
router.patch('/profile', authMiddleware, updateProfileLanguage);

module.exports = router;
