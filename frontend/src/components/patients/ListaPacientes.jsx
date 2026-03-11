import { useTranslation } from 'react-i18next';
import Paciente from './Paciente';
import './ListaPacientes.css';

const ListaPacientes = ({ pacientes, onViewPaciente, onEditPaciente }) => {
  const { t } = useTranslation('common');

  if (pacientes.length === 0) {
    return (
      <div className="lista-pacientes-empty">
        <p>{t('patientList.empty')}</p>
      </div>
    );
  }

  return (
    <div className="lista-pacientes-container">
      <div className="lista-pacientes-header">
        <div className="header-cell header-id">{t('patientList.colId')}</div>
        <div className="header-cell header-paciente">{t('patientList.colPatient')}</div>
        <div className="header-cell header-fecha">{t('patientList.colLastVisit')}</div>
        <div className="header-cell header-fecha">{t('patientList.colNextAppt')}</div>
        <div className="header-cell header-acciones">{t('patientList.colActions')}</div>
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
