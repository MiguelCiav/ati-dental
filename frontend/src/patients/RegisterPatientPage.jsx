import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, InputField, SelectField, Button } from '../components';
import { Mail, Phone, Calendar, User, FileText, MapPin } from 'lucide-react';
import patientsService from '../services/patientsService';

const RegisterPatientPage = () => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        fechaNacimiento: '',
        genero: 'Masculino',
        telefono: '',
        email: '',
        direccion: '',
        tipoSangre: '',
        alergias: '',
        condicionesMedicas: '',
        notasAdicionales: ''
    });

    const generoOptions = [
        { value: '', label: t('registerPatient.selectOption'), disabled: true },
        { value: 'Masculino', label: t('registerPatient.male') },
        { value: 'Femenino', label: t('registerPatient.female') }
    ];

    const tipoSangreOptions = [
        { value: '', label: t('registerPatient.selectOption'), disabled: true },
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await patientsService.createPatient(formData);
            navigate('/patients');
        } catch (err) {
            setError(err.message || t('registerPatient.errorDefault'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header page-header-content" style={{ marginBottom: '24px' }}>
                <div className="page-header-text">
                    <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
                        {t('registerPatient.title')}
                    </h1>
                    <p style={{ color: '#666', fontSize: '15px' }}>
                        {t('registerPatient.subtitle')}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card padding="large" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '8px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                        <User size={20} color="#5e3a8f" />
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{t('registerPatient.personalData')}</h2>
                    </div>

                    {error && (
                        <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label={t('registerPatient.fullName')}
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder={t('registerPatient.fullNamePlaceholder')}
                            required
                        />
                        <InputField
                            label={t('registerPatient.idCard')}
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label={t('registerPatient.birthDate')}
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            icon={Calendar}
                        />
                        <SelectField
                            label={t('registerPatient.gender')}
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            options={generoOptions}
                        />
                        <InputField
                            label={t('registerPatient.phone')}
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="(041X) 000-0000"
                            icon={Phone}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label={t('registerPatient.email')}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('registerPatient.emailPlaceholder')}
                            icon={Mail}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '10px' }}>
                        <InputField
                            label={t('registerPatient.address')}
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder={t('registerPatient.addressPlaceholder')}
                        />
                    </div>
                </Card>

                {/* Clinical Info Section */}
                <Card padding="large" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '8px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                        <FileText size={20} color="#5e3a8f" />
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{t('registerPatient.clinicalInfo')}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '20px', marginBottom: '20px' }}>
                        <SelectField
                            label={t('registerPatient.bloodType')}
                            name="tipoSangre"
                            value={formData.tipoSangre}
                            onChange={handleChange}
                            options={tipoSangreOptions}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label={t('registerPatient.allergies')}
                            name="alergias"
                            value={formData.alergias}
                            onChange={handleChange}
                            placeholder={t('registerPatient.allergiesPlaceholder')}
                            multiline
                            rows={3}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label={t('registerPatient.medicalConditions')}
                            name="condicionesMedicas"
                            value={formData.condicionesMedicas}
                            onChange={handleChange}
                            placeholder={t('registerPatient.medicalConditionsPlaceholder')}
                            multiline
                            rows={3}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '10px' }}>
                        <InputField
                            label={t('registerPatient.additionalNotes')}
                            name="notasAdicionales"
                            value={formData.notasAdicionales}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                    </div>
                </Card>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
                    <Button type="button" variant="outline" onClick={() => navigate('/patients')} disabled={loading}>
                        {t('registerPatient.cancel')}
                    </Button>
                    <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                        {loading ? t('registerPatient.saving') : t('registerPatient.save')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RegisterPatientPage;
