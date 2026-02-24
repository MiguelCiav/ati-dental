import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();

  const routeLabels = {
    '/': 'Inicio',
    '/patients': 'Listado de Pacientes',
    '/patients/register': 'Registrar Paciente',
    '/profile': 'Perfil e Idioma',
    '/contact': 'Contacto',
    '/settings': 'Ajustes',
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Inicio', path: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = routeLabels[currentPath] || segment;
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
