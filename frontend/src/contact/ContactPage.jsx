import { useTranslation } from 'react-i18next';
import { Mail, Phone, Briefcase, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
  const { t } = useTranslation('common');

  const contacts = [
    {
      id: 1,
      name: 'Dr. Alejandro V.',
      role: t('contactPage.roles.medicalDirector', 'Director Médico'),
      description: t('contactPage.descriptions.medicalDirector', 'Responsable de la supervisión clínica y protocolos de atención al paciente.'),
      email: 'alejandro.v@atidental.com',
      phone: '+58 414 321 6547',
      status: 'online',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 2,
      name: 'Dra. Sofia M.',
      role: t('contactPage.roles.operationsManager', 'Gerente de Operaciones'),
      description: t('contactPage.descriptions.operationsManager', 'Encargada de la logística diaria, recursos humanos y gestión de citas.'),
      email: 'sofia.m@atidental.com',
      phone: '+58 412 345 6789',
      status: 'offline',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 3,
      name: 'Ing. Carlos R.',
      role: t('contactPage.roles.techSupport', 'Soporte Técnico'),
      description: t('contactPage.descriptions.techSupport', 'Mantenimiento de la plataforma, seguridad de datos y soporte TI.'),
      email: 'carlos.r@atidental.com',
      phone: '+58 422 123 4567',
      status: 'online',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    }
  ];

  return (
    <div className="page-container contact-page">
      <div className="page-header page-header-content">
        <div className="page-header-text">
          <h1>{t('contactPage.title', 'Información y Contacto')}</h1>
          <p>{t('contactPage.subtitle', 'Gestione la comunicación con el equipo y revise la actividad reciente.')}</p>
        </div>
      </div>

      <div className="contact-section">
        <h2 className="contact-section-title">
          <Briefcase className="contact-section-icon" size={20} />
          {t('contactPage.siteManagers', 'Responsables del Sitio')}
        </h2>

        <div className="contact-grid">
          {contacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <div className="contact-card-top-border"></div>
              <div className="contact-card-content">
                <div className="contact-avatar-container">
                  <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
                  <span className={`contact-status-indicator ${contact.status}`}></span>
                </div>
                
                <h3 className="contact-name">{contact.name}</h3>
                <p className="contact-role">{contact.role}</p>
                
                <p className="contact-description">{contact.description}</p>
                
                <div className="contact-actions">
                  <a href={`mailto:${contact.email}`} className="contact-action-btn" title="Enviar correo">
                    <Mail size={18} />
                  </a>
                  <a href={`tel:${contact.phone}`} className="contact-action-btn" title="Llamar">
                    <Phone size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="contact-section social-media-section">
        <div className="social-media-content">
          <h2 className="contact-section-title justify-center">
            {t('contactPage.socialMedia', 'Nuestras Redes Sociales')}
          </h2>
          <p className="social-media-desc">
            {t('contactPage.socialMediaDesc', 'Síguenos para mantenerte al día con nuestras novedades.')}
          </p>
          <div className="social-media-links">
            <a href="https://facebook.com/atidental" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper facebook" title="Facebook">
              <Facebook size={24} />
            </a>
            <a href="https://instagram.com/atidental" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper instagram" title="Instagram">
              <Instagram size={24} />
            </a>
            <a href="https://tiktok.com/@atidental" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper tiktok" title="TikTok">
              {/* Custom SVG for TikTok since older lucide-react might not have it */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg>
            </a>
            <a href="https://linkedin.com/company/atidental" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper linkedin" title="LinkedIn">
              <Linkedin size={24} />
            </a>
            <a href="https://twitter.com/atidental" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper twitter" title="Twitter">
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
