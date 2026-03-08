import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ChevronRight, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { t } = useTranslation('common');

  const routeLabels = {
    '/': t('menu.dashboard', 'Inicio'),
    '/patients': t('menu.patientsList', 'Listado de Pacientes'),
    '/patients/register': t('menu.registerPatient', 'Registrar Paciente'),
    '/reports': t('menu.reports', 'Reportes'),
    '/profile': t('menu.profileSettings', 'Ajustes de Perfil'),
    '/contact': t('menu.contact', 'Contacto'),
    '/settings': t('menu.settings', 'Ajustes'),
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: t('menu.dashboard', 'Inicio'), path: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      let label = routeLabels[currentPath] || segment;
      
      // If segment is a typical Mongo ID in the patients route
      if (currentPath.match(/^\/patients\/[a-fA-F0-9]{24}$/)) {
        label = t('patientDetails.breadcrumbDetails', 'Ficha del Paciente');
      } else if (currentPath.match(/^\/patients\/[a-fA-F0-9]{24}\/edit$/)) {
        label = t('patients.edit', 'Editar');
      }

      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="navbar">
      <button className="hamburger-button" onClick={onToggleSidebar} aria-label="Toggle menu">
        <Menu size={24} />
      </button>

      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-item home">
          <Home size={18} />
        </Link>

        {breadcrumbs.slice(1).map((crumb, index) => (
          <div key={crumb.path} className="breadcrumb-wrapper">
            <ChevronRight size={14} className="breadcrumb-separator" />
            {index === breadcrumbs.length - 2 ? (
              <span className="breadcrumb-item current">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="breadcrumb-item">
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
