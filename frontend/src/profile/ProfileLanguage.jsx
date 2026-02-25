import React, { useState } from 'react';
import { Globe, CheckCircle2, User, Mail, Phone } from 'lucide-react';
import { Card, Button, InputField } from '../components';
import './ProfileLanguage.css';

const ProfileLanguage = () => {
    const [selectedLang, setSelectedLang] = useState('es');

    return (
        <Card
            title="Idioma de la Interfaz"
            icon={Globe}
        >
            <div className="profile-language-content">
                <p className="language-description">
                    Selecciona el idioma preferido para la interfaz del sistema ATI Dental.
                </p>

                <div className="language-options-grid">
                    <div
                        className={`language-option-card ${selectedLang === 'es' ? 'selected' : ''}`}
                        onClick={() => setSelectedLang('es')}
                    >
                        <div className="language-option-header">
                            <span className="language-name">Español</span>
                            {selectedLang === 'es' && <CheckCircle2 className="check-icon" size={24} />}
                        </div>
                        <p className="language-hint">Idioma predeterminado para Venezuela y Latam.</p>
                    </div>

                    <div
                        className={`language-option-card ${selectedLang === 'en' ? 'selected' : ''}`}
                        onClick={() => setSelectedLang('en')}
                    >
                        <div className="language-option-header">
                            <span className="language-name">English (Inglés)</span>
                            {selectedLang === 'en' && <CheckCircle2 className="check-icon" size={24} />}
                        </div>
                        <p className="language-hint">Standard interface language.</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const ProfilePage = () => {
    const [profileData, setProfileData] = useState({
        nombre: 'John',
        apellidos: 'Smith',
        email: 'dr.smith@atidental.com',
        telefono: '+34 600 000 000',
        bio: ''
    });

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card
                title="Información Personal"
                icon={User}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '8px' }}>
                        <div className="profile-avatar">
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235e3a8f'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="Profile" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: '4px' }}>Foto de Perfil</div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
                                <Button variant="secondary" size="small">Cambiar</Button>
                                <Button variant="ghost" size="small" style={{ color: '#d32f2f' }}>Eliminar</Button>
                            </div>
                            <div style={{ fontSize: '12px', color: '#999' }}>JPG, GIF o PNG. Max 1MB.</div>
                        </div>
                    </div>

                    <div className="form-grid">
                        <InputField
                            label="Nombre"
                            name="nombre"
                            value={profileData.nombre}
                            onChange={handleProfileChange}
                            placeholder="John"
                        />
                        <InputField
                            label="Apellidos"
                            name="apellidos"
                            value={profileData.apellidos}
                            onChange={handleProfileChange}
                            placeholder="Smith"
                        />
                    </div>

                    <div className="form-grid">
                        <InputField
                            label="Correo Electrónico"
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            icon={Mail}
                        />
                        <InputField
                            label="Teléfono"
                            type="tel"
                            name="telefono"
                            value={profileData.telefono}
                            onChange={handleProfileChange}
                            icon={Phone}
                        />
                    </div>

                    <InputField
                        label="Bio Profesional"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        placeholder="Breve descripción para el perfil público."
                        multiline
                        rows={4}
                    />
                </div>
            </Card>

            <ProfileLanguage />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <Button variant="secondary">
                    Cancelar
                </Button>
                <Button variant="primary" onClick={() => console.log('Guardar perfil e idioma')}>
                    Guardar Cambios
                </Button>
            </div>
        </div>
    );
}

export default ProfilePage;
