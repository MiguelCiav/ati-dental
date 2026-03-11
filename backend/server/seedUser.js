const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://admin:password123@mongo:27017/mean-docker?authSource=admin';

async function seedUser() {
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000
        });
        console.log('MongoDB conectado correctamente para crear usuario');

        // Create a user
        const user = new User({
            nombre: 'Administrador',
            email: 'admin@atidental.com',
            password: 'password123',
            role: 'admin'
        });

        await user.save();
        console.log('Usuario de prueba creado: admin@atidental.com / password123');
        process.exit(0);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        process.exit(1);
    }
}

seedUser();
