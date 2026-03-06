import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../components';
import { SearchAndFilter, ListaPacientes } from '../components/patients';
import patientsService from '../services/patientsService';

const PatientsPage = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recientes');

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await patientsService.getPatients(searchTerm);
        setPacientes(data);
      } catch (error) {
        console.error('Error al cargar pacientes:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchPatients, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
        <h1>{t('patients.listTitle')}</h1>
        <p>{t('patients.listSubtitle')}</p>
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
            {t('patients.loading')}
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
