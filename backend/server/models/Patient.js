const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  telefono: {
    type: String,
    trim: true
  },
  cedula: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  foto: {
    type: String,
    default: null
  },
  genero: {
    type: String,
    enum: ['Masculino', 'Femenino'],
    default: 'Masculino'
  },
  fechaNacimiento: {
    type: Date
  },
  edad: {
    type: Number
  },
  direccion: {
    type: String,
    trim: true
  },
  ultimaVisita: {
    type: Date,
    default: null
  },
  proximaCita: {
    type: Date,
    default: null
  },
  activo: {
    type: Boolean,
    default: true
  },
  tipoSangre: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    default: null
  },
  alergias: {
    type: String,
    trim: true,
    default: null
  },
  condicionesMedicas: {
    type: String,
    trim: true,
    default: null
  },
  notasAdicionales: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de búsqueda
patientSchema.index({ nombre: 'text', email: 'text', cedula: 'text' });

// Método virtual para obtener el ID en formato #P-XXXX
patientSchema.virtual('displayId').get(function () {
  return `#P-${this._id.toString().slice(-4).toUpperCase()}`;
});

// Asegurar que los virtuals se incluyan en JSON
patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema);

