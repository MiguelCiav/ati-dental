const mongoose = require('mongoose');
const Patient = require('../../models/Patient');
const reportsService = require('../../services/reportsService');

describe('ReportsService - Unit Tests', () => {
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
    await Patient.deleteMany({});
  });

  beforeEach(async () => {
    await Patient.deleteMany({});
  });

  describe('getStatistics', () => {
    it('debe retornar estadísticas vacías cuando no hay pacientes', async () => {
      const stats = await reportsService.getStatistics();

      expect(stats.totalPatients).toBe(0);
      expect(stats.avgAge).toBe(0);
      expect(stats.patientsByMonth).toEqual([]);
      expect(stats.patientsByAge).toEqual([]);
    });

    it('debe calcular correctamente el total de pacientes', async () => {
      await Patient.insertMany([
        {
          nombre: 'Paciente 1',
          email: 'p1@unittest.com',
          cedula: 'UNIT1111A',
          fechaNacimiento: new Date('1990-01-01'),
          edad: 36,
          activo: true
        },
        {
          nombre: 'Paciente 2',
          email: 'p2@unittest.com',
          cedula: 'UNIT2222B',
          fechaNacimiento: new Date('1985-05-15'),
          edad: 40,
          activo: true
        }
      ]);

      const stats = await reportsService.getStatistics();
      expect(stats.totalPatients).toBe(2);
    });

    it('debe calcular correctamente la edad promedio', async () => {
      await Patient.insertMany([
        {
          nombre: 'Paciente 1',
          email: 'p1@unittest.com',
          cedula: 'UNIT3333C',
          fechaNacimiento: new Date('2006-01-01'),
          edad: 20,
          activo: true
        },
        {
          nombre: 'Paciente 2',
          email: 'p2@unittest.com',
          cedula: 'UNIT4444D',
          fechaNacimiento: new Date('1986-01-01'),
          edad: 40,
          activo: true
        }
      ]);

      const stats = await reportsService.getStatistics();
      expect(stats.avgAge).toBe(30);
    });

    it('debe agrupar correctamente por rango de edad', async () => {
      await Patient.insertMany([
        {
          nombre: 'Niño',
          email: 'nino@unittest.com',
          cedula: 'UNIT5555E',
          fechaNacimiento: new Date('2015-01-01'),
          edad: 11,
          activo: true
        },
        {
          nombre: 'Joven',
          email: 'joven@unittest.com',
          cedula: 'UNIT6666F',
          fechaNacimiento: new Date('2000-01-01'),
          edad: 26,
          activo: true
        },
        {
          nombre: 'Adulto',
          email: 'adulto@unittest.com',
          cedula: 'UNIT7777G',
          fechaNacimiento: new Date('1980-01-01'),
          edad: 46,
          activo: true
        }
      ]);

      const stats = await reportsService.getStatistics();
      const ageGroups = stats.patientsByAge;

      const group018 = ageGroups.find(g => g.rango === '0-18');
      const group1930 = ageGroups.find(g => g.rango === '19-30');
      const group3150 = ageGroups.find(g => g.rango === '31-50');

      expect(group018.cantidad).toBe(1);
      expect(group1930.cantidad).toBe(1);
      expect(group3150.cantidad).toBe(1);
    });

    it('debe agrupar correctamente visitas por mes', async () => {
      await Patient.insertMany([
        {
          nombre: 'Paciente 1',
          email: 'p1@unittest.com',
          cedula: 'UNITAAAAK',
          fechaNacimiento: new Date('1990-01-01'),
          edad: 36,
          ultimaVisita: new Date('2026-01-15'),
          activo: true
        },
        {
          nombre: 'Paciente 2',
          email: 'p2@unittest.com',
          cedula: 'UNITBBBL',
          fechaNacimiento: new Date('1985-01-01'),
          edad: 41,
          ultimaVisita: new Date('2026-01-20'),
          activo: true
        },
        {
          nombre: 'Paciente 3',
          email: 'p3@unittest.com',
          cedula: 'UNITCCCCM',
          fechaNacimiento: new Date('1995-01-01'),
          edad: 31,
          ultimaVisita: new Date('2026-02-10'),
          activo: true
        }
      ]);

      const stats = await reportsService.getStatistics();
      const monthGroups = stats.patientsByMonth;

      const enero = monthGroups.find(m => m.month === '1/2026');
      const febrero = monthGroups.find(m => m.month === '2/2026');

      expect(enero.visitas).toBe(2);
      expect(febrero.visitas).toBe(1);
    });
  });

  describe('calculateAge', () => {
    it('debe calcular correctamente la edad', () => {
      const birthDate = new Date('1990-01-01');
      const age = reportsService.calculateAge(birthDate);
      
      expect(age).toBeGreaterThanOrEqual(35);
      expect(age).toBeLessThanOrEqual(37);
    });
  });
});
