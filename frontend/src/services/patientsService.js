// URL base de la API desde variables de entorno o localhost por defecto
// Nota: En Docker dev, el backend está en puerto 5000 (mapeado 5000:3000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Servicio para interactuar con el endpoint de pacientes
 */
const patientsService = {
  /**
   * Obtener lista de pacientes con búsqueda opcional
   * @param {string} searchTerm - Término de búsqueda opcional
   * @returns {Promise<Array>} Lista de pacientes
   */
  async getPatients(searchTerm = '') {
    try {
      const url = searchTerm
        ? `${API_URL}/patients?search=${encodeURIComponent(searchTerm)}`
        : `${API_URL}/patients`;

      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      throw error;
    }
  },

  /**
   * Obtener un paciente por ID
   * @param {string} id - ID del paciente
   * @returns {Promise<Object>} Datos del paciente
   */
  async getPatientById(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/patients/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener paciente:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo paciente
   * @param {Object} patientData - Datos del paciente
   * @returns {Promise<Object>} Paciente creado
   */
  async createPatient(patientData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error al crear paciente:', error);
      throw error;
    }
  },

  /**
   * Actualizar un paciente existente
   * @param {string} id - ID del paciente
   * @param {Object} patientData - Nuevos datos del paciente
   * @returns {Promise<Object>} Paciente actualizado
   */
  async updatePatient(id, patientData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      throw error;
    }
  }
};

export default patientsService;
