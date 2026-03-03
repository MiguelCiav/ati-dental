const mongoose = require('mongoose');
const Patient = require('../../models/Patient');
const reportsService = require('../../services/reportsService');
const PDFDocument = require('pdfkit');

describe('PDF Generation - Performance Tests', () => {
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

  it('debe obtener estadísticas en menos de 2 segundos con 100 pacientes', async () => {
    const patients = [];
    for (let i = 0; i < 100; i++) {
      patients.push({
        nombre: `Paciente Perf100 ${i}`,
        email: `pacienteperf100-${i}@test.com`,
        cedula: `P100${String(i).padStart(4, '0')}${String.fromCharCode(65 + (i % 26))}`,
        fechaNacimiento: new Date(1960 + (i % 40), (i % 12), 1),
        edad: 30 + (i % 40),
        ultimaVisita: new Date(2026, (i % 6), 1),
        activo: true
      });
    }

    await Patient.insertMany(patients);

    const startTime = Date.now();
    const stats = await reportsService.getStatistics();
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    expect(executionTime).toBeLessThan(2000);
    expect(stats.totalPatients).toBe(100);
  }, 10000);

  it('debe generar PDF en menos de 5 segundos con 50 pacientes', async () => {
    const patients = [];
    for (let i = 0; i < 50; i++) {
      patients.push({
        nombre: `Paciente Perf50 ${i}`,
        email: `pacienteperf50-${i}@test.com`,
        cedula: `P50${String(i).padStart(5, '0')}${String.fromCharCode(65 + (i % 26))}`,
        fechaNacimiento: new Date(1970 + (i % 30), (i % 12), 1),
        edad: 30 + (i % 30),
        ultimaVisita: new Date(2026, (i % 6), 1),
        activo: true
      });
    }

    await Patient.insertMany(patients);

    const startTime = Date.now();
    const stats = await reportsService.getStatistics();
    
    const doc = new PDFDocument();
    const chunks = [];
    
    doc.on('data', chunk => chunks.push(chunk));
    
    const pdfPromise = new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    doc.fontSize(20).text('Reporte de Prueba', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Total Pacientes: ${stats.totalPatients}`);
    doc.text(`Edad Promedio: ${stats.avgAge}`);
    
    stats.patientsByMonth.forEach(item => {
      doc.text(`${item.month}: ${item.visitas} visitas`);
    });
    
    doc.end();
    
    const pdfBuffer = await pdfPromise;
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    expect(executionTime).toBeLessThan(5000);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  }, 10000);

  it('debe procesar correctamente 500 pacientes sin timeout', async () => {
    const patients = [];
    for (let i = 0; i < 500; i++) {
      patients.push({
        nombre: `Paciente Perf ${i}`,
        email: `pacienteperf${i}@test.com`,
        cedula: `PERF${String(i).padStart(5, '0')}${String.fromCharCode(65 + (i % 26))}`,
        fechaNacimiento: new Date(1950 + (i % 60), (i % 12), 1),
        edad: 20 + (i % 60),
        ultimaVisita: new Date(2025 + (i % 2), (i % 12), 1),
        activo: true
      });
    }

    const insertResult = await Patient.insertMany(patients);
    expect(insertResult.length).toBe(500);

    const startTime = Date.now();
    const stats = await reportsService.getStatistics();
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    expect(stats.totalPatients).toBe(500);
    expect(executionTime).toBeLessThan(10000);
    console.log(`Tiempo de procesamiento de 500 pacientes: ${executionTime}ms`);
  }, 15000);

  it('debe calcular estadísticas eficientemente sin memoria excesiva', async () => {
    const patients = [];
    for (let i = 0; i < 200; i++) {
      patients.push({
        nombre: `Paciente Perf200 ${i}`,
        email: `pacienteperf200-${i}@test.com`,
        cedula: `P200${String(i).padStart(4, '0')}${String.fromCharCode(65 + (i % 26))}`,
        fechaNacimiento: new Date(1960 + (i % 50), (i % 12), 1),
        edad: 25 + (i % 50),
        ultimaVisita: new Date(2026, (i % 3), 1),
        activo: true
      });
    }

    await Patient.insertMany(patients);

    const memBefore = process.memoryUsage().heapUsed;
    await reportsService.getStatistics();
    const memAfter = process.memoryUsage().heapUsed;
    
    const memoryIncreaseMB = (memAfter - memBefore) / 1024 / 1024;

    expect(memoryIncreaseMB).toBeLessThan(50);
    console.log(`Incremento de memoria: ${memoryIncreaseMB.toFixed(2)} MB`);
  }, 15000);
});
