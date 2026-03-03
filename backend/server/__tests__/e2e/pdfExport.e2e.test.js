const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const Patient = require('../../models/Patient');
const User = require('../../models/User');
const authRoutes = require('../../routes/auth');
const reportsRoutes = require('../../routes/reports');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);

describe('PDF Export - E2E Tests', () => {
  let authToken;

  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI || 
      'mongodb://admin:password123@localhost:27018/test-reports?authSource=admin';
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 10000
      });
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Patient.deleteMany({});
  });

  beforeEach(async () => {
    await Patient.deleteMany({});
    await User.deleteMany({});

    const user = new User({
      nombre: 'Admin Test E2E',
      email: 'admin-e2e@test.com',
      password: 'password123',
      role: 'admin'
    });
    await user.save();
  });

  it('debe completar el flujo completo: login -> cargar datos -> obtener stats -> exportar PDF', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin-e2e@test.com',
        password: 'password123'
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    authToken = loginResponse.body.data.token;

    await Patient.insertMany([
      {
        nombre: 'María González',
        email: 'maria@e2etest.com',
        cedula: 'E2E11111A',
        fechaNacimiento: new Date('1985-03-15'),
        edad: 41,
        ultimaVisita: new Date('2026-02-15'),
        activo: true
      },
      {
        nombre: 'Carlos Ruiz',
        email: 'carlos@e2etest.com',
        cedula: 'E2E22222B',
        fechaNacimiento: new Date('1990-07-22'),
        edad: 35,
        ultimaVisita: new Date('2026-02-20'),
        activo: true
      },
      {
        nombre: 'Laura Blanco',
        email: 'laura@e2etest.com',
        cedula: 'E2E33333C',
        fechaNacimiento: new Date('1995-11-08'),
        edad: 30,
        ultimaVisita: new Date('2026-01-10'),
        activo: true
      }
    ]);

    const statsResponse = await request(app)
      .get('/api/reports/statistics')
      .set('Authorization', `Bearer ${authToken}`);

    expect(statsResponse.status).toBe(200);
    expect(statsResponse.body.totalPatients).toBe(3);

    const pdfResponse = await request(app)
      .get('/api/reports/export-pdf')
      .set('Authorization', `Bearer ${authToken}`);

    expect(pdfResponse.status).toBe(200);
    expect(pdfResponse.headers['content-type']).toBe('application/pdf');
    expect(pdfResponse.body.length).toBeGreaterThan(1000);
    
    const pdfSignature = pdfResponse.body.slice(0, 4).toString();
    expect(pdfSignature).toBe('%PDF');
  });

  it('debe manejar correctamente usuarios sin autenticación en el flujo', async () => {
    const statsResponse = await request(app)
      .get('/api/reports/statistics');

    expect(statsResponse.status).toBe(401);

    const pdfResponse = await request(app)
      .get('/api/reports/export-pdf');

    expect(pdfResponse.status).toBe(401);
  });

  it('debe generar PDF incluso sin pacientes en la base de datos', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin-e2e@test.com',
        password: 'password123'
      });

    authToken = loginResponse.body.data.token;

    const pdfResponse = await request(app)
      .get('/api/reports/export-pdf')
      .set('Authorization', `Bearer ${authToken}`);

    expect(pdfResponse.status).toBe(200);
    expect(pdfResponse.headers['content-type']).toBe('application/pdf');
  });
});
