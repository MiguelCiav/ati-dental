const mongoose = require('mongoose');
const Patient = require('./models/Patient');

const mongoURI = process.env.MONGO_URI ||
  'mongodb://admin:password123@mongo:27017/mean-docker?authSource=admin';

// Datos de ejemplo
const samplePatients = [
  {
    nombre: 'María González',
    email: 'maria.gonzalez@email.com',
    telefono: '+34 600 111 222',
    cedula: '12345678A',
    ultimaVisita: new Date('2023-10-15'),
    proximaCita: new Date('2023-10-22T10:00:00'),
    activo: true
  },
  {
    nombre: 'Carlos Ruiz',
    email: 'cruiz88@email.com',
    telefono: '+34 600 222 333',
    cedula: '23456789B',
    ultimaVisita: new Date('2023-10-10'),
    proximaCita: null,
    activo: true
  },
  {
    nombre: 'Laura Blanco',
    email: 'laura.b@email.com',
    telefono: '+34 600 333 444',
    cedula: '34567890C',
    ultimaVisita: new Date('2023-10-02'),
    proximaCita: new Date('2023-10-25T16:30:00'),
    activo: true
  },
  {
    nombre: 'Jorge Mendez',
    email: 'jmendez@email.com',
    telefono: '+34 600 444 555',
    cedula: '45678901D',
    ultimaVisita: new Date('2023-08-12'),
    proximaCita: null,
    activo: true
  },
  {
    nombre: 'Ana Lopez',
    email: 'ana.lo@email.com',
    telefono: '+34 600 555 666',
    cedula: '56789012E',
    ultimaVisita: new Date('2023-10-18'),
    proximaCita: new Date('2023-10-30T09:15:00'),
    activo: true
  }
];

async function seedDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('MongoDB conectado correctamente');

    // Limpiar la colección de pacientes
    await Patient.deleteMany({});
    console.log('Colección de pacientes limpiada');

    // Insertar datos de ejemplo
    const patients = await Patient.insertMany(samplePatients);
    console.log(`${patients.length} pacientes insertados correctamente`);

    // Mostrar los IDs generados
    patients.forEach(patient => {
      console.log(`- ${patient.nombre}: ${patient.displayId}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error al popular la base de datos:', error);
    process.exit(1);
  }
}

seedDatabase();

