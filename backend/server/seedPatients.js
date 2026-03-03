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
    fechaNacimiento: new Date('1985-03-15'),
    edad: 41,
    ultimaVisita: new Date('2026-02-15'),
    proximaCita: new Date('2026-03-22T10:00:00'),
    activo: true
  },
  {
    nombre: 'Carlos Ruiz',
    email: 'cruiz88@email.com',
    telefono: '+34 600 222 333',
    cedula: '23456789B',
    fechaNacimiento: new Date('1988-07-22'),
    edad: 37,
    ultimaVisita: new Date('2026-02-10'),
    proximaCita: null,
    activo: true
  },
  {
    nombre: 'Laura Blanco',
    email: 'laura.b@email.com',
    telefono: '+34 600 333 444',
    cedula: '34567890C',
    fechaNacimiento: new Date('1992-11-08'),
    edad: 33,
    ultimaVisita: new Date('2026-01-20'),
    proximaCita: new Date('2026-03-25T16:30:00'),
    activo: true
  },
  {
    nombre: 'Jorge Mendez',
    email: 'jmendez@email.com',
    telefono: '+34 600 444 555',
    cedula: '45678901D',
    fechaNacimiento: new Date('1975-05-30'),
    edad: 50,
    ultimaVisita: new Date('2025-12-12'),
    proximaCita: null,
    activo: true
  },
  {
    nombre: 'Ana Lopez',
    email: 'ana.lo@email.com',
    telefono: '+34 600 555 666',
    cedula: '56789012E',
    fechaNacimiento: new Date('1990-09-18'),
    edad: 35,
    ultimaVisita: new Date('2026-02-28'),
    proximaCita: new Date('2026-03-30T09:15:00'),
    activo: true
  },
  {
    nombre: 'Pedro Sánchez',
    email: 'pedro.sanchez@email.com',
    telefono: '+34 600 666 777',
    cedula: '67890123F',
    fechaNacimiento: new Date('2005-12-05'),
    edad: 20,
    ultimaVisita: new Date('2026-01-15'),
    proximaCita: new Date('2026-04-05T11:00:00'),
    activo: true
  },
  {
    nombre: 'Isabel Fernández',
    email: 'isabel.f@email.com',
    telefono: '+34 600 777 888',
    cedula: '78901234G',
    fechaNacimiento: new Date('1955-04-20'),
    edad: 70,
    ultimaVisita: new Date('2026-02-05'),
    proximaCita: new Date('2026-03-15T14:00:00'),
    activo: true
  },
  {
    nombre: 'Roberto García',
    email: 'roberto.g@email.com',
    telefono: '+34 600 888 999',
    cedula: '89012345H',
    fechaNacimiento: new Date('2010-08-12'),
    edad: 15,
    ultimaVisita: new Date('2026-01-25'),
    proximaCita: new Date('2026-04-10T10:30:00'),
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

