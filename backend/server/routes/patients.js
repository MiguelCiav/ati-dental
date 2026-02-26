const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

/**
 * GET /api/patients
 * Obtener lista de pacientes con búsqueda opcional
 * Query params: search (opcional) - busca en nombre, email o cédula
 */
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = { activo: true };

    // Si hay término de búsqueda, usar búsqueda de texto o regex
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      
      // Búsqueda flexible usando regex para nombre, email y cédula
      query.$or = [
        { nombre: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { cedula: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query)
      .select('nombre email telefono cedula foto ultimaVisita proximaCita')
      .sort({ ultimaVisita: -1 })
      .lean();

    // Formatear respuesta con displayId
    const formattedPatients = patients.map(patient => ({
      id: `#P-${patient._id.toString().slice(-4).toUpperCase()}`,
      _id: patient._id,
      nombre: patient.nombre,
      email: patient.email,
      telefono: patient.telefono,
      cedula: patient.cedula,
      foto: patient.foto,
      ultimaVisita: patient.ultimaVisita,
      proximaCita: patient.proximaCita
    }));

    res.json(formattedPatients);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ 
      message: 'Error al obtener la lista de pacientes',
      error: error.message 
    });
  }
});

/**
 * GET /api/patients/:id
 * Obtener un paciente por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    res.status(500).json({ 
      message: 'Error al obtener el paciente',
      error: error.message 
    });
  }
});

/**
 * POST /api/patients
 * Crear un nuevo paciente
 */
router.post('/', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(400).json({ 
      message: 'Error al crear el paciente',
      error: error.message 
    });
  }
});

/**
 * PUT /api/patients/:id
 * Actualizar un paciente existente
 */
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(400).json({ 
      message: 'Error al actualizar el paciente',
      error: error.message 
    });
  }
});

/**
 * DELETE /api/patients/:id
 * Eliminar (desactivar) un paciente
 */
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.json({ message: 'Paciente eliminado correctamente', patient });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ 
      message: 'Error al eliminar el paciente',
      error: error.message 
    });
  }
});

module.exports = router;

