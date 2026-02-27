import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle2, User, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, Button, InputField } from '../components';
import { useAuth } from '../context/AuthContext';
import './ProfileLanguage.css';

const ProfileLanguage = ({ selectedLang, setSelectedLang, t }) => {
    return (
        <Card
            title={t('profile.titleLanguage', 'Idioma de la Interfaz')}
            icon={Globe}
        >
            <div className="profile-language-content">
                <p className="language-description">
                    {t('profile.languageDesc', 'Selecciona el idioma preferido para la interfaz del sistema ATI Dental.')}
                </p>

                <div className="language-options-grid">
                    <div
                        className={`language-option-card ${selectedLang === 'es' ? 'selected' : ''}`}
                        onClick={() => setSelectedLang('es')}
                    >
                        <div className="language-option-header">
                            <span className="language-name">{t('profile.langEs', 'Español')}</span>
                            {selectedLang === 'es' && <CheckCircle2 className="check-icon" size={24} />}
                        </div>
                        <p className="language-hint">{t('profile.langEsHint', 'Idioma predeterminado para Venezuela y Latam.')}</p>
                    </div>

                    <div
                        className={`language-option-card ${selectedLang === 'en' ? 'selected' : ''}`}
                        onClick={() => setSelectedLang('en')}
                    >
                        <div className="language-option-header">
                            <span className="language-name">{t('profile.langEn', 'English (Inglés)')}</span>
                            {selectedLang === 'en' && <CheckCircle2 className="check-icon" size={24} />}
                        </div>
                        <p className="language-hint">{t('profile.langEnHint', 'Standard interface language.')}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const ProfilePage = () => {
    const { t, i18n } = useTranslation('common');
    const { user, login } = useAuth();

    // Initialize selectedLang with the current i18n active language
    const [selectedLang, setSelectedLang] = useState(i18n.language || 'es');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [profileData, setProfileData] = useState({
        nombre: 'John',
        apellidos: 'Smith',
        email: 'dr.smith@atidental.com',
        telefono: '+34 600 000 000',
        bio: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                nombre: user.nombre || 'Administrador',
                apellidos: user.apellidos || '',
                email: user.email || '',
                telefono: user.telefono || '',
                bio: user.bio || ''
            });
            // Also sync the selection box if the user context loads/changes
            if (user.language) {
                setSelectedLang(user.language);
            }
        }
    }, [user]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${apiUrl}/users/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ language: selectedLang })
            });
            const data = await res.json();

            if (data.success) {
                // Actualizar el idioma global de react-i18next
                i18n.changeLanguage(selectedLang);

                // Actualizar el usuario en AuthContext
                if (user) {
                    const updatedUser = { ...user, language: selectedLang };
                    login(token, updatedUser);
                }

                setMessage(t('profile.success', 'Perfil guardado exitosamente.'));
            } else {
                setMessage(data.message || 'Error');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error de conexión');
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card
                title={t('profile.titleInfo', 'Información Personal')}
                icon={User}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '8px' }}>
                        <div className="profile-avatar">
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235e3a8f'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="Profile" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: '4px' }}>{t('profile.avatar', 'Foto de Perfil')}</div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
                                <Button variant="secondary" size="small">{t('profile.avatarChange', 'Cambiar')}</Button>
                                <Button variant="ghost" size="small" style={{ color: '#d32f2f' }}>{t('profile.avatarDelete', 'Eliminar')}</Button>
                            </div>
                            <div style={{ fontSize: '12px', color: '#999' }}>{t('profile.avatarHint', 'JPG, GIF o PNG. Max 1MB.')}</div>
                        </div>
                    </div>

                    <div className="form-grid">
                        <InputField
                            label={t('profile.firstName', 'Nombre')}
                            name="nombre"
                            value={profileData.nombre}
                            onChange={handleProfileChange}
                            placeholder="John"
                        />
                        <InputField
                            label={t('profile.lastName', 'Apellidos')}
                            name="apellidos"
                            value={profileData.apellidos}
                            onChange={handleProfileChange}
                            placeholder="Smith"
                        />
                    </div>

                    <div className="form-grid">
                        <InputField
                            label={t('profile.email', 'Correo Electrónico')}
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            icon={Mail}
                        />
                        <InputField
                            label={t('profile.phone', 'Teléfono')}
                            type="tel"
                            name="telefono"
                            value={profileData.telefono}
                            onChange={handleProfileChange}
                            icon={Phone}
                        />
                    </div>

                    <InputField
                        label={t('profile.bio', 'Bio Profesional')}
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        placeholder={t('profile.bioPlaceholder', 'Breve descripción para el perfil público.')}
                        multiline
                        rows={4}
                    />
                </div>
            </Card>

            <ProfileLanguage selectedLang={selectedLang} setSelectedLang={setSelectedLang} t={t} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <div style={{ color: 'green', fontWeight: '500' }}>
                    {message}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="secondary">
                        {t('profile.cancel', 'Cancelar')}
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving}>
                        {saving ? t('common.loading', 'Cargando...') : t('profile.saveChanges', 'Guardar Cambios')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
