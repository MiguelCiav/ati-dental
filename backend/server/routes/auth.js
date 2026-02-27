const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

/**
 * POST /api/auth/login
 * Autenticar usuario y generar token JWT
 * Body: { email, password }
 */
router.post('/login', login);

module.exports = router;
