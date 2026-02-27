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
  fechaNacimiento: {
    type: Date
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
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de búsqueda
patientSchema.index({ nombre: 'text', email: 'text', cedula: 'text' });

// Método virtual para obtener el ID en formato #P-XXXX
patientSchema.virtual('displayId').get(function() {
  return `#P-${this._id.toString().slice(-4).toUpperCase()}`;
});

// Asegurar que los virtuals se incluyan en JSON
patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema);

