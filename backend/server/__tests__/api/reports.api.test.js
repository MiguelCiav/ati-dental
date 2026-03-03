const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const Patient = require('../../models/Patient');
const User = require('../../models/User');
const reportsRoutes = require('../../routes/reports');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/reports', reportsRoutes);

describe('Reports API - Integration Tests', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI || 
      'mongodb://admin:password123@localhost:27018/test-reports?authSource=admin';
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 10000
      });
    }

    await Patient.deleteMany({});
    await User.deleteMany({});
    
    testUser = new User({
      nombre: 'Test Admin API',
      email: 'testadmin-api@test.com',
      password: 'testpass123',
      role: 'admin'
    });
    await testUser.save();

    authToken = jwt.sign(
      { userId: testUser._id, email: testUser.email, role: testUser.role },
      process.env.JWT_SECRET || 'este_es_un_secreto_super_seguro_para_desarrollo_123!',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Patient.deleteMany({});
  });

  beforeEach(async () => {
    await Patient.deleteMany({});
  });

  describe('GET /api/reports/statistics', () => {
    it('debe retornar 401 sin token de autenticación', async () => {
      const response = await request(app)
        .get('/api/reports/statistics');

      expect(response.status).toBe(401);
    });

    it('debe retornar estadísticas cuando hay pacientes', async () => {
      await Patient.deleteMany({});
      await Patient.insertMany([
        {
          nombre: 'Paciente 1',
          email: 'p1@apitest.com',
          cedula: 'API11111A',
          fechaNacimiento: new Date('1990-01-01'),
          edad: 36,
          ultimaVisita: new Date('2026-01-15'),
          activo: true
        },
        {
          nombre: 'Paciente 2',
          email: 'p2@apitest.com',
          cedula: 'API22222B',
          fechaNacimiento: new Date('1985-01-01'),
          edad: 41,
          ultimaVisita: new Date('2026-02-10'),
          activo: true
        }
      ]);

      const response = await request(app)
        .get('/api/reports/statistics')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalPatients', 2);
      expect(response.body).toHaveProperty('avgAge');
      expect(response.body).toHaveProperty('patientsByMonth');
      expect(response.body).toHaveProperty('patientsByAge');
    });

    it('debe retornar estadísticas vacías cuando no hay pacientes', async () => {
      const response = await request(app)
        .get('/api/reports/statistics')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.totalPatients).toBe(0);
      expect(response.body.avgAge).toBe(0);
    });
  });

  describe('GET /api/reports/export-pdf', () => {
    it('debe retornar 401 sin token de autenticación', async () => {
      const response = await request(app)
        .get('/api/reports/export-pdf');

      expect(response.status).toBe(401);
    });

    it('debe generar un PDF con content-type correcto', async () => {
      await Patient.deleteMany({});
      await Patient.insertMany([
        {
          nombre: 'Paciente Test',
          email: 'ptest@apitest.com',
          cedula: 'API33333C',
          fechaNacimiento: new Date('1990-01-01'),
          edad: 36,
          ultimaVisita: new Date('2026-01-15'),
          activo: true
        }
      ]);

      const response = await request(app)
        .get('/api/reports/export-pdf')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');
      expect(response.headers['content-disposition']).toMatch(/attachment; filename=reporte-estadisticas-\d+\.pdf/);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('debe generar un PDF válido con datos', async () => {
      await Patient.deleteMany({});
      await Patient.insertMany([
        {
          nombre: 'María González',
          email: 'maria@apitest.com',
          cedula: 'API44444D',
          fechaNacimiento: new Date('1990-01-01'),
          edad: 36,
          ultimaVisita: new Date('2026-02-15'),
          activo: true
        },
        {
          nombre: 'Carlos Ruiz',
          email: 'carlos@apitest.com',
          cedula: 'API55555E',
          fechaNacimiento: new Date('1980-05-20'),
          edad: 45,
          ultimaVisita: new Date('2026-02-10'),
          activo: true
        }
      ]);

      const response = await request(app)
        .get('/api/reports/export-pdf')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(1000);
      
      const pdfSignature = response.body.slice(0, 4).toString();
      expect(pdfSignature).toBe('%PDF');
    });
  });
});
