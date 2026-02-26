import Paciente from './Paciente';
import './ListaPacientes.css';

const ListaPacientes = ({ pacientes, onViewPaciente, onEditPaciente }) => {
  if (pacientes.length === 0) {
    return (
      <div className="lista-pacientes-empty">
        <p>No se encontraron pacientes.</p>
      </div>
    );
  }

  return (
    <div className="lista-pacientes-container">
      <div className="lista-pacientes-header">
        <div className="header-cell header-id">ID</div>
        <div className="header-cell header-paciente">PACIENTE</div>
        <div className="header-cell header-fecha">ÚLTIMA VISITA</div>
        <div className="header-cell header-fecha">PRÓXIMA CITA</div>
        <div className="header-cell header-acciones">ACCIONES</div>
      </div>

      <div className="lista-pacientes-body">
        {pacientes.map((paciente) => (
          <Paciente
            key={paciente.id}
            paciente={paciente}
            onView={onViewPaciente}
            onEdit={onEditPaciente}
          />
        ))}
      </div>
    </div>
  );
};

export default ListaPacientes;

