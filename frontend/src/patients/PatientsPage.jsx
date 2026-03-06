import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components';
import { SearchAndFilter, ListaPacientes } from '../components/patients';
import patientsService from '../services/patientsService';

const PatientsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize from location state if available (from back button), otherwise use defaults
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
  const [sortOrder, setSortOrder] = useState(location.state?.sortOrder || 'recientes');

  // Cargar pacientes al montar el componente y cuando cambia el término de búsqueda
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await patientsService.getPatients(searchTerm);
        setPacientes(data);
      } catch (error) {
        console.error('Error al cargar pacientes:', error);
        // Mantener la lista actual en caso de error
      } finally {
        setLoading(false);
      }
    };

    // Debounce simple: esperar 500ms después de que el usuario deje de escribir
    const timeoutId = setTimeout(fetchPatients, 500);

    // Limpiar el timeout si el usuario sigue escribiendo
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Ordenar pacientes según el criterio seleccionado
  const sortedPacientes = [...pacientes].sort((a, b) => {
    switch (sortOrder) {
      case 'recientes':
        return new Date(b.ultimaVisita || 0) - new Date(a.ultimaVisita || 0);
      case 'antiguos':
        return new Date(a.ultimaVisita || 0) - new Date(b.ultimaVisita || 0);
      case 'nombre-asc':
        return a.nombre.localeCompare(b.nombre);
      case 'nombre-desc':
        return b.nombre.localeCompare(a.nombre);
      default:
        return 0;
    }
  });

  const handleViewPaciente = (paciente) => {
    // Navegar a la página de detalles del paciente, enviando los filtros actuales
    navigate(`/patients/${paciente._id}`, {
      state: { searchTerm, sortOrder }
    });
  };

  const handleEditPaciente = (paciente) => {
    navigate(`/patients/${paciente._id}/edit`, {
      state: { searchTerm, sortOrder }
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Listado de Pacientes</h1>
        <p>Gestiona y consulta el historial de todos tus pacientes.</p>
      </div>

      <Card padding="medium" style={{ marginBottom: '24px' }}>
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </Card>

      <Card noPadding>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
            Cargando pacientes...
          </div>
        ) : (
          <ListaPacientes
            pacientes={sortedPacientes}
            onViewPaciente={handleViewPaciente}
            onEditPaciente={handleEditPaciente}
          />
        )}
      </Card>
    </div>
  );
};

export default PatientsPage;

