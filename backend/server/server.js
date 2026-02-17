const express = require('express'); 
const mongoose = require('mongoose'); 
const app = express(); 

// Middleware para procesar datos en formato JSON 
app.use(express.json()); 

// Credenciales para entorno de desarrollo / práctica 
// Se utiliza una variable de entorno o la cadena de conexión por defecto 
const mongoURI = process.env.MONGO_URI || 
  'mongodb://admin:password123@mongo:27017/mean-docker?authSource=admin'; 

// Conexión robusta con Timeout de 5 segundos 
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 10000 
})
.then(() => console.log('MongoDB conectado correctamente')) 
.catch(err => console.error('Error de conexión a Mongo:', err)); 

// Ruta principal para verificar el estado de la API 
app.get('/', (req, res) => { 
  res.status(200).json({ 
    status: 'API Running', 
    environment: process.env.NODE_ENV || 'development', 
    nodeVersion: process.version 
  }); 
}); 

const PORT = process.env.PORT || 3000; 

// Escuchamos en 0.0.0.0 para permitir la comunicación externa en Docker 
app.listen(PORT, '0.0.0.0', () => { 
  console.log(`Hola mundo puerto ${PORT}`); 
}); 