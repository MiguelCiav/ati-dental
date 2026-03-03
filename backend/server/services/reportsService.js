const Patient = require('../models/Patient');

/**
 * Servicio para generar reportes y estadísticas de pacientes
 */
class ReportsService {
  /**
   * Obtiene estadísticas agregadas de todos los pacientes
   */
  async getStatistics() {
    try {
      const patients = await Patient.find({ activo: true }).lean();

      if (!patients || patients.length === 0) {
        return {
          totalPatients: 0,
          avgAge: 0,
          patientsByMonth: [],
          patientsByAge: []
        };
      }

      const stats = {
        totalPatients: patients.length,
        avgAge: this.calculateAverageAge(patients),
        patientsByMonth: this.groupByMonth(patients),
        patientsByAge: this.groupByAgeRange(patients)
      };

      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  /**
   * Calcula la edad promedio de los pacientes
   */
  calculateAverageAge(patients) {
    const patientsWithAge = patients.filter(p => p.fechaNacimiento);
    
    if (patientsWithAge.length === 0) return 0;

    const totalAge = patientsWithAge.reduce((sum, patient) => {
      const age = this.calculateAge(patient.fechaNacimiento);
      return sum + age;
    }, 0);

    return Math.round(totalAge / patientsWithAge.length);
  }

  /**
   * Calcula la edad de un paciente a partir de su fecha de nacimiento
   */
  calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Agrupa pacientes por mes de última visita
   */
  groupByMonth(patients) {
    const monthData = {};

    patients.forEach(patient => {
      if (patient.ultimaVisita) {
        const date = new Date(patient.ultimaVisita);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthData[monthYear] = (monthData[monthYear] || 0) + 1;
      }
    });

    return Object.entries(monthData)
      .map(([month, visitas]) => ({ month, visitas }))
      .sort((a, b) => {
        const [ma, ya] = a.month.split('/').map(Number);
        const [mb, yb] = b.month.split('/').map(Number);
        return (ya - yb) || (ma - mb);
      })
      .slice(-6);
  }

  /**
   * Agrupa pacientes por rango de edad
   */
  groupByAgeRange(patients) {
    const ageGroups = {
      '0-18': 0,
      '19-30': 0,
      '31-50': 0,
      '51-70': 0,
      '70+': 0
    };

    patients.forEach(patient => {
      if (patient.fechaNacimiento) {
        const age = this.calculateAge(patient.fechaNacimiento);
        if (age <= 18) ageGroups['0-18']++;
        else if (age <= 30) ageGroups['19-30']++;
        else if (age <= 50) ageGroups['31-50']++;
        else if (age <= 70) ageGroups['51-70']++;
        else ageGroups['70+']++;
      }
    });

    return Object.entries(ageGroups).map(([rango, cantidad]) => ({
      rango,
      cantidad
    }));
  }

}

module.exports = new ReportsService();
