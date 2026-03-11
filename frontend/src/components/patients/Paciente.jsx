import { useTranslation } from 'react-i18next';
import { Eye, Edit, Calendar } from 'lucide-react';
import './Paciente.css';

const Paciente = ({ paciente, onView, onEdit }) => {
  const { t } = useTranslation('common');

  const getInitials = (name) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      '#5e3a8f', // purple
      '#2563eb', // blue
      '#059669', // green
      '#dc2626', // red
      '#ea580c', // orange
      '#7c3aed', // violet
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const months = t('patientList.months').split('_');
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const months = t('patientList.months').split('_');
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${day} ${month}, ${displayHours}:${minutes} ${ampm}`;
  };

  const avatarColor = getAvatarColor(paciente.nombre);
  const initials = getInitials(paciente.nombre);

  return (
    <div className="paciente-row" data-testid="patient-row">
      <div className="paciente-cell paciente-id">
        {paciente.id}
      </div>

      <div className="paciente-cell paciente-info">
        <div className="paciente-avatar" style={{ backgroundColor: avatarColor }}>
          {paciente.foto ? (
            <img src={paciente.foto} alt={paciente.nombre} />
          ) : (
            <span className="paciente-initials">{initials}</span>
          )}
        </div>
        <div className="paciente-details">
          <div className="paciente-nombre" data-testid="patient-name">{paciente.nombre}</div>
          <div className="paciente-email">{paciente.email}</div>
        </div>
      </div>

      <div className="paciente-cell paciente-fecha">
        {formatDate(paciente.ultimaVisita)}
      </div>

      <div className="paciente-cell paciente-fecha">
        {paciente.proximaCita ? (
          <div className="proxima-cita">
            <Calendar size={16} className="cita-icon" />
            <span>{formatDateTime(paciente.proximaCita)}</span>
          </div>
        ) : (
          '-'
        )}
      </div>

      <div className="paciente-cell paciente-acciones">
        <button
          className="action-button view-button"
          onClick={() => onView(paciente)}
          title={t('patientList.viewDetails')}
          data-testid="view-patient-btn"
        >
          <Eye size={18} />
        </button>
        <button
          className="action-button edit-button"
          onClick={() => onEdit(paciente)}
          title={t('patientList.editPatient')}
          data-testid="edit-patient-btn"
        >
          <Edit size={18} />
        </button>
      </div>
    </div>
  );
};

export default Paciente;
