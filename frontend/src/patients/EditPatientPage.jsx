import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, InputField, SelectField, Button } from '../components';
import { Mail, Phone, Calendar, User, FileText, ChevronRight } from 'lucide-react';
import patientsService from '../services/patientsService';

const EditPatientPage = () => {
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
        { value: '', label: 'Seleccionar...', disabled: true },
        { value: 'Masculino', label: 'Masculino' },
        { value: 'Femenino', label: 'Femenino' }
    ];

    const tipoSangreOptions = [
        { value: '', label: 'Seleccionar...', disabled: true },
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
                setError(err.message || 'Error al cargar la información del paciente.');
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
            setError(err.message || 'Error al actualizar el paciente');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <p style={{ color: '#666' }}>Cargando información del paciente...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Breadcrumb Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div className="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                    <Link to="/patients" className="breadcrumb-link" style={{ color: '#666', textDecoration: 'none' }}>Pacientes</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" style={{ color: '#999' }} />
                    <Link to={`/patients/${id}`} className="breadcrumb-link" style={{ color: '#666', textDecoration: 'none' }}>Ficha del Paciente</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" style={{ color: '#999' }} />
                    <span className="breadcrumb-current" style={{ color: '#5e3a8f', fontWeight: '500' }}>Editar</span>
                </div>
            </div>

            <div className="page-header" style={{ marginBottom: '24px' }}>
                <h1 style={{ color: '#5e3a8f', fontSize: '28px', marginBottom: '8px' }}>
                    Editar Paciente
                </h1>
                <p style={{ color: '#666', fontSize: '15px' }}>
                    Modifique los datos del paciente y guarde los cambios.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card padding="large" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '8px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                        <User size={20} color="#5e3a8f" />
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Datos Personales</h2>
                    </div>

                    {error && (
                        <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label="Nombre Completo"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej. Juan Pérez"
                            required
                        />
                        <InputField
                            label="Cédula de Identidad"
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label="Fecha de Nacimiento"
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            icon={Calendar}
                        />
                        <SelectField
                            label="Género"
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            options={generoOptions}
                        />
                        <InputField
                            label="Teléfono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="(041X) 000-0000"
                            icon={Phone}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label="Correo Electrónico"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
                            icon={Mail}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '10px' }}>
                        <InputField
                            label="Dirección de Residencia"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder="Calle, Número, Ciudad"
                        />
                    </div>
                </Card>

                {/* Información Clínica Básica Section */}
                <Card padding="large" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '8px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                        <FileText size={20} color="#5e3a8f" />
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Información Clínica Básica</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '20px', marginBottom: '20px' }}>
                        <SelectField
                            label="Tipo de Sangre"
                            name="tipoSangre"
                            value={formData.tipoSangre}
                            onChange={handleChange}
                            options={tipoSangreOptions}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label="Alergias Conocidas"
                            name="alergias"
                            value={formData.alergias}
                            onChange={handleChange}
                            placeholder="Listar medicamentos, alimentos o materiales (ej. Penicilina, Látex)..."
                            multiline
                            rows={3}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                        <InputField
                            label="Condiciones Médicas Previas"
                            name="condicionesMedicas"
                            value={formData.condicionesMedicas}
                            onChange={handleChange}
                            placeholder="Diabetes, Hipertensión, Cirugías recientes..."
                            multiline
                            rows={3}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '10px' }}>
                        <InputField
                            label="Notas Adicionales"
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
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditPatientPage;
