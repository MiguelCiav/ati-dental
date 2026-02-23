import { Link, useLocation } from 'react-router-dom';
import { List, UserPlus, Cog, MessageCircleQuestionMark } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      id: 'patients-list',
      label: 'Listado de Pacientes',
      icon: List,
      path: '/patients',
    },
    {
      id: 'register-patient',
      label: 'Registrar Paciente',
      icon: UserPlus,
      path: '/patients/register',
    },
    {
      id: 'profile',
      label: 'Perfil e Idioma',
      icon: Cog,
      path: '/profile',
    },
    {
      id: 'contact',
      label: 'Contacto',
      icon: MessageCircleQuestionMark,
      path: '/contact',
    },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="36" viewBox="0 0 30 36" fill="none">
              <path d="M21.25 5.65625C22.625 5.65625 23.8021 6.14583 24.7812 7.125C25.7604 8.10417 26.25 9.28125 26.25 10.6562C26.25 10.8854 26.2344 11.1927 26.2031 11.5781C26.1719 11.9635 26.125 12.4062 26.0625 12.9062L24.3438 25.5C24.2396 26.2917 23.8802 26.9375 23.2656 27.4375C22.651 27.9375 21.9479 28.1875 21.1562 28.1875C20.6771 28.1875 20.2344 28.0833 19.8281 27.875C19.4219 27.6667 19.0833 27.375 18.8125 27L15.4688 22.125C15.4271 22.0417 15.3594 21.9844 15.2656 21.9531C15.1719 21.9219 15.0729 21.9062 14.9688 21.9062C14.8854 21.9062 14.7188 22 14.4688 22.1875L11.2188 26.9062C10.9271 27.3229 10.5677 27.6406 10.1406 27.8594C9.71354 28.0781 9.26042 28.1875 8.78125 28.1875C7.98958 28.1875 7.29167 27.9323 6.6875 27.4219C6.08333 26.9115 5.72917 26.2604 5.625 25.4688L3.9375 12.9062C3.875 12.4062 3.82812 11.9635 3.79688 11.5781C3.76562 11.1927 3.75 10.8854 3.75 10.6562C3.75 9.28125 4.23958 8.10417 5.21875 7.125C6.19792 6.14583 7.375 5.65625 8.75 5.65625C9.5 5.65625 10.099 5.75521 10.5469 5.95312C10.9948 6.15104 11.4271 6.36458 11.8438 6.59375C12.2604 6.82292 12.7031 7.03646 13.1719 7.23438C13.6406 7.43229 14.25 7.53125 15 7.53125C15.75 7.53125 16.3594 7.43229 16.8281 7.23438C17.2969 7.03646 17.7396 6.82292 18.1562 6.59375C18.5729 6.36458 19.0104 6.15104 19.4688 5.95312C19.9271 5.75521 20.5208 5.65625 21.25 5.65625ZM21.25 8.15625C20.7708 8.15625 20.349 8.25521 19.9844 8.45312C19.6198 8.65104 19.2188 8.86458 18.7812 9.09375C18.3438 9.32292 17.8333 9.53646 17.25 9.73438C16.6667 9.93229 15.9167 10.0312 15 10.0312C14.0833 10.0312 13.3333 9.93229 12.75 9.73438C12.1667 9.53646 11.6562 9.32292 11.2188 9.09375C10.7812 8.86458 10.3802 8.65104 10.0156 8.45312C9.65104 8.25521 9.22917 8.15625 8.75 8.15625C8.0625 8.15625 7.47396 8.40104 6.98438 8.89062C6.49479 9.38021 6.25 9.96875 6.25 10.6562C6.25 10.8229 6.26042 11.0625 6.28125 11.375C6.30208 11.6875 6.34375 12.0521 6.40625 12.4688L8.125 25.125C8.14583 25.2917 8.21875 25.4219 8.34375 25.5156C8.46875 25.6094 8.61458 25.6562 8.78125 25.6562C8.88542 25.6562 8.97917 25.6354 9.0625 25.5938C9.14583 25.5521 9.20833 25.4896 9.25 25.4062L12.4062 20.7812C12.6979 20.3646 13.0729 20.0312 13.5312 19.7812C13.9896 19.5312 14.4792 19.4062 15 19.4062C15.5208 19.4062 16.0104 19.5312 16.4688 19.7812C16.9271 20.0312 17.3021 20.3646 17.5938 20.7812L20.8125 25.5C20.8542 25.5625 20.9062 25.6094 20.9688 25.6406C21.0312 25.6719 21.1042 25.6875 21.1875 25.6875C21.3542 25.6875 21.5052 25.6406 21.6406 25.5469C21.776 25.4531 21.8542 25.3229 21.875 25.1562L23.5938 12.4688C23.6562 12.0521 23.6979 11.6875 23.7188 11.375C23.7396 11.0625 23.75 10.8229 23.75 10.6562C23.75 9.96875 23.5052 9.38021 23.0156 8.89062C22.526 8.40104 21.9375 8.15625 21.25 8.15625Z" fill="white"/>
            </svg>
          </div>
          <span className="logo-text">ATI Dental</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`sidebar-menu-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <Icon className="menu-icon" size={20} />
                  <span className="menu-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="User" />
          </div>
          <div className="user-info">
            <div className="user-name">Dr. Ramírez</div>
            <div className="user-role">Odontólogo</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
