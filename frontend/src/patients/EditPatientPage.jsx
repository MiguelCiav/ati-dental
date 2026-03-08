import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, InputField, SelectField, Button } from '../components';
import { Mail, Phone, Calendar, User, FileText, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import patientsService from '../services/patientsService';

const EditPatientPage = () => {
    const { t } = useTranslation('common');
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
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
        { value: '', label: t('registerPatient.selectOption', 'Seleccionar...'), disabled: true },
        { value: 'Masculino', label: t('registerPatient.male', 'Masculino') },
        { value: 'Femenino', label: t('registerPatient.female', 'Femenino') }
    ];

    const tipoSangreOptions = [
        { value: '', label: t('registerPatient.selectOption', 'Seleccionar...'), disabled: true },
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
    ];

    useEffect(() => {
        const fetchPatient = async () => {
            setFetching(true);
            setError(null);
            try {
                const data = await patientsService.getPatientById(id);
                // Format date to YYYY-MM-DD for input element
                let formattedDate = '';
                if (data.fechaNacimiento) {
                    const dateObj = new Date(data.fechaNacimiento);
                    formattedDate = dateObj.toISOString().split('T')[0];
                }

                setFormData({
                    nombre: data.nombre || '',
                    cedula: data.cedula || '',
                    fechaNacimiento: formattedDate,
                    genero: data.genero || 'Masculino',
                    telefono: data.telefono || '',
                    email: data.email || '',
                    direccion: data.direccion || '',
                    tipoSangre: data.tipoSangre || '',
                    alergias: data.alergias || '',
                    condicionesMedicas: data.condicionesMedicas || '',
                    notasAdicionales: data.notasAdicionales || ''
                });
            } catch (err) {
                setError(err.message || t('registerPatient.errorDefault', 'Error al cargar la información del paciente.'));
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchPatient();
        }
    }, [id]);

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
            await patientsService.updatePatient(id, formData);
            navigate(`/patients/${id}`);
        } catch (err) {
            setError(err.message || t('registerPatient.errorDefault', 'Error al actualizar el paciente'));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <p style={{ color: '#666' }}>{t('common.loading', 'Cargando...')}</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header page-header-content" style={{ marginBottom: '24px' }}>
                <div className="page-header-text">
                    <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
                        {t('patients.edit', 'Editar')} {t('patients.title', 'Paciente')}
                    </h1>
                    <p style={{ color: '#666', fontSize: '15px' }}>
                        {t('editPatient.subtitle', 'Modifique los datos del paciente y guarde los cambios.')}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card padding="large" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '8px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                        <User size={20} color="#5e3a8f" />
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{t('registerPatient.personalData', 'Datos Personales')}</h2>
                    </div>

                    {error && (
                        <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label={t('registerPatient.fullName', 'Nombre Completo')}
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder={t('registerPatient.fullNamePlaceholder', 'Ej. Juan Pérez')}
                            required
                        />
                        <InputField
                            label={t('registerPatient.idCard', 'Cédula de Identidad')}
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label={t('registerPatient.birthDate', 'Fecha de Nacimiento')}
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            icon={Calendar}
                        />
                        <SelectField
                            label={t('registerPatient.gender', 'Género')}
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            options={generoOptions}
                        />
                        <InputField
                            label={t('registerPatient.phone', 'Teléfono')}
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="(041X) 000-0000"
                            icon={Phone}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label={t('registerPatient.email', 'Correo Electrónico')}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('registerPatient.emailPlaceholder', 'correo@ejemplo.com')}
                            icon={Mail}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '10px' }}>
                        <InputField
                            label={t('registerPatient.address', 'Dirección de Residencia')}
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder={t('registerPatient.addressPlaceholder', 'Calle, Número, Ciudad')}
                        />
                    </div>
                </Card>

                {/* Información Clínica Básica Section */}
                <Card padding="large" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '8px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                        <FileText size={20} color="#5e3a8f" />
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{t('registerPatient.clinicalInfo', 'Información Clínica Básica')}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '20px', marginBottom: '20px' }}>
                        <SelectField
                            label={t('registerPatient.bloodType', 'Tipo de Sangre')}
                            name="tipoSangre"
                            value={formData.tipoSangre}
                            onChange={handleChange}
                            options={tipoSangreOptions}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label={t('registerPatient.allergies', 'Alergias Conocidas')}
                            name="alergias"
                            value={formData.alergias}
                            onChange={handleChange}
                            placeholder={t('registerPatient.allergiesPlaceholder', 'Listar medicamentos...')}
                            multiline
                            rows={3}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label={t('registerPatient.medicalConditions', 'Condiciones Médicas Previas')}
                            name="condicionesMedicas"
                            value={formData.condicionesMedicas}
                            onChange={handleChange}
                            placeholder={t('registerPatient.medicalConditionsPlaceholder', 'Diabetes, Hipertensión...')}
                            multiline
                            rows={3}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '10px' }}>
                        <InputField
                            label={t('registerPatient.additionalNotes', 'Notas Adicionales')}
                            name="notasAdicionales"
                            value={formData.notasAdicionales}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                    </div>
                </Card>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
                    <Button type="button" variant="outline" onClick={() => navigate(`/patients/${id}`)} disabled={loading}>
                        {t('common.cancel', 'Cancelar')}
                    </Button>
                    <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                        {loading ? t('common.loading', 'Cargando...') : t('common.save', 'Guardar Cambios')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditPatientPage;
