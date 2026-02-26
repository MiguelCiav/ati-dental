import { useState } from 'react';
import { Card } from '../components';
import { SearchAndFilter, ListaPacientes } from '../components/patients';

const PatientsPage = () => {
  const [pacientes, setPacientes] = useState([
    {
      id: '#P-0042',
      nombre: 'María González',
      email: 'maria.gonzalez@email.com',
      foto: null,
      ultimaVisita: '2023-10-15',
      proximaCita: '2023-10-22T10:00:00',
    },
    {
      id: '#P-0043',
      nombre: 'Carlos Ruiz',
      email: 'cruiz88@email.com',
      foto: null,
      ultimaVisita: '2023-10-10',
      proximaCita: null,
    },
    {
      id: '#P-0044',
      nombre: 'Laura Blanco',
      email: 'laura.b@email.com',
      foto: null,
      ultimaVisita: '2023-10-02',
      proximaCita: '2023-10-25T16:30:00',
    },
    {
      id: '#P-0045',
      nombre: 'Jorge Mendez',
      email: 'jmendez@email.com',
      foto: null,
      ultimaVisita: '2023-08-12',
      proximaCita: null,
    },
    {
      id: '#P-0046',
      nombre: 'Ana Lopez',
      email: 'ana.lo@email.com',
      foto: null,
      ultimaVisita: '2023-10-18',
      proximaCita: '2023-10-30T09:15:00',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recientes');

  // Filtrar y ordenar pacientes
  const filteredAndSortedPacientes = pacientes
    .filter((paciente) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        paciente.nombre.toLowerCase().includes(searchLower) ||
        paciente.email.toLowerCase().includes(searchLower) ||
        paciente.id.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'recientes':
          return new Date(b.ultimaVisita) - new Date(a.ultimaVisita);
        case 'antiguos':
          return new Date(a.ultimaVisita) - new Date(b.ultimaVisita);
        case 'nombre-asc':
          return a.nombre.localeCompare(b.nombre);
        case 'nombre-desc':
          return b.nombre.localeCompare(a.nombre);
        default:
          return 0;
      }
    });

  const handleViewPaciente = (paciente) => {
    console.log('Ver paciente:', paciente);
    // Aquí se puede navegar a la página de detalles del paciente
  };

  const handleEditPaciente = (paciente) => {
    console.log('Editar paciente:', paciente);
    // Aquí se puede abrir un modal para editar el paciente
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
        <ListaPacientes
          pacientes={filteredAndSortedPacientes}
          onViewPaciente={handleViewPaciente}
          onEditPaciente={handleEditPaciente}
        />
      </Card>
    </div>
  );
};

export default PatientsPage;

