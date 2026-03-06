import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, Button } from '../components';
import {
    ArrowLeft, User, Mail, Phone, Calendar,
    MapPin, Activity, FileText, Droplets, AlertTriangle,
    Edit2, Plus, Clock, History, FileEdit, Trash2, ChevronRight
} from 'lucide-react';
import patientsService from '../services/patientsService';
import './PatientDetailsPage.css';

const PatientDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatient = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await patientsService.getPatientById(id);
                setPatient(data);
            } catch (err) {
                setError(err.message || 'Error al cargar la información del paciente.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id]);

    const handleBack = () => {
        // Navigate back but try to preserve any passed state (like search filters)
        navigate('/patients', { state: location.state });
    };

    const formatDate = (dateString, includeTime = false) => {
        if (!dateString) return 'No especificado';
        const date = new Date(dateString);

        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }

        return new Intl.DateTimeFormat('es-ES', options).format(date);
    };

    // Helper function to calculate age
    const calculateAge = (dobString) => {
        if (!dobString) return '';
        const dob = new Date(dobString);
        const diffMs = Date.now() - dob.getTime();
        const ageDt = new Date(diffMs);
        return Math.abs(ageDt.getUTCFullYear() - 1970) + " años";
    };

    // Mock data for treatments since backend doesn't have it yet
    const mockTreatments = [
        { id: 1, name: 'Limpieza Dental Profunda', category: 'Preventivo', date: '20 Sep 2023', details: 'Profilaxis completa y aplicación de flúor.', doctor: 'Dr. Smith', duration: '45 mins', status: 'Completado' },
        { id: 2, name: 'Obturación Resina (Pieza 46)', category: '', date: '15 Ago 2023', details: 'Restauración con resina compuesta debido a caries leve.', doctor: 'Dra. Martínez', duration: '30 mins', status: 'Completado' },
        { id: 3, name: 'Primera Consulta', category: '', date: '02 Ene 2023', details: 'Evaluación general, radiografías panorámicas y plan de tratamiento.', doctor: 'Dr. Smith', duration: '60 mins', status: 'Completado' },
    ];

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <p style={{ color: '#666' }}>Cargando información del paciente...</p>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="page-container">
                <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    {error || 'No se encontró el paciente solicitado.'}
                </div>
                <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft size={16} /> Volver al listado
                </Button>
            </div>
        );
    }

    return (
        <div className="patient-details-container page-container">

            {/* Breadcrumb & Actions Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div className="breadcrumb">
                    <Link to="/patients" state={location.state} className="breadcrumb-link">Pacientes</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">Ficha del Paciente</span>
                </div>

                <div className="actions-header">
                    <Button variant="outline" onClick={() => navigate(`/patients/${patient._id}/edit`)} style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#666', borderColor: '#e0e0e0', backgroundColor: 'white' }}>
                        <Edit2 size={16} /> Editar
                    </Button>
                    <Button style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Calendar size={16} /> Nueva Cita
                    </Button>
                </div>
            </div>

            {/* Purple Hero Card */}
            <div className="hero-card">
                <img src={`https://ui-avatars.com/api/?name=${patient.nombre}&background=ffffff&color=7b5da6&size=100`} alt="Avatar" className="hero-avatar" />
                <h1 className="hero-name">{patient.nombre}</h1>
                <div className="hero-meta">
                    {patient.cedula} {patient.genero && `• ${patient.genero}`} {patient.fechaNacimiento && `• ${calculateAge(patient.fechaNacimiento)}`}
                </div>
                {patient.telefono && (
                    <div className="hero-phone">
                        <Phone size={14} /> {patient.telefono}
                    </div>
                )}
            </div>

            {/* Main Content 2-Column Grid */}
            <div className="main-content">

                {/* Left Column: Info Cards */}
                <div className="sidebar-section">
                    {/* Personal Info */}
                    <Card padding="large" style={{ borderRadius: '12px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#5e3a8f', marginBottom: '24px', marginTop: 0 }}>Información Personal</h2>

                        <div className="info-block">
                            <div className="info-label">Correo Electrónico</div>
                            <div className="info-value">{patient.email || 'No especificado'}</div>
                        </div>

                        <div className="info-block" style={{ marginBottom: 0 }}>
                            <div className="info-label">Dirección</div>
                            <div className="info-value">{patient.direccion || 'No especificada'}</div>
                        </div>
                    </Card>

                    {/* Clinical Info */}
                    <Card padding="large" style={{ borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '8px', color: '#333' }}>
                            <Activity size={20} color="#5e3a8f" />
                            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 0 -4px' }}>Información Clínica Básica</h2>
                        </div>

                        <div className="info-block">
                            <div className="info-label">Tipo de Sangre</div>
                            <div className="info-value">{patient.tipoSangre || 'No especificado'}</div>
                        </div>

                        <div className="info-block">
                            <div className="info-label">Alergias Conocidas</div>
                            <div className="info-value">{patient.alergias || 'Ninguna registrada'}</div>
                        </div>

                        <div className="info-block">
                            <div className="info-label">Condiciones Médicas Previas</div>
                            <div className="info-value">{patient.condicionesMedicas || 'Ninguna registrada'}</div>
                        </div>

                        <div className="info-block" style={{ marginBottom: 0 }}>
                            <div className="info-label">Notas Adicionales</div>
                            <div className="info-value">{patient.notasAdicionales || 'Ninguna'}</div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Appointments & History */}
                <div>

                    {/* Top Appointments Summary */}
                    <div className="appointments-summary">
                        <div className="appointment-card">
                            <div>
                                <div className="appointment-card-title">PRÓXIMA CITA</div>
                                <div className="appointment-card-date">14 Oct, 10:00</div>
                            </div>
                        </div>
                        <div className="appointment-card">
                            <div>
                                <div className="appointment-card-title">ÚLTIMA VISITA</div>
                                <div className="appointment-card-date">{patient.ultimaVisita ? formatDate(patient.ultimaVisita) : '20 Sep 2023'}</div>
                            </div>
                            <History size={20} color="#999" />
                        </div>
                    </div>

                    {/* Treatment History List */}
                    <Card padding="large" style={{ borderRadius: '12px' }}>
                        <div className="treatments-header">
                            <h2 className="treatments-title">Historial de Tratamientos</h2>
                            <Button style={{ backgroundColor: '#5e3a8f', display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 16px', fontSize: '13px' }}>
                                <Plus size={16} /> Añadir Tratamiento
                            </Button>
                        </div>

                        <div className="timeline">
                            {mockTreatments.map((tx, index) => (
                                <div key={tx.id} className="treatment-item">
                                    <div className={`treatment-icon ${index === 0 ? 'treatment-icon-completed' : ''}`}>
                                        <Activity size={16} color={index === 0 ? '#7b5da6' : '#999'} />
                                    </div>

                                    <div className="treatment-content">
                                        <div className="treatment-header">
                                            <div className="treatment-title-container">
                                                <h3 className="treatment-name">{tx.name}</h3>
                                                {tx.category && <span className="treatment-badge">{tx.category}</span>}
                                            </div>
                                            <div className="treatment-date">{tx.date}</div>
                                        </div>

                                        <p className="treatment-desc">{tx.details}</p>

                                        <div className="treatment-meta">
                                            <div className="treatment-meta-left">
                                                <div className="treatment-meta-item">
                                                    <User size={12} /> {tx.doctor}
                                                </div>
                                                <div className="treatment-meta-item">
                                                    <Clock size={12} /> {tx.duration}
                                                </div>
                                            </div>
                                            <div className="status-completed">{tx.status}</div>
                                        </div>

                                        <div className="treatment-actions">
                                            <button className="tx-action-btn"><FileEdit size={12} /> Modificar</button>
                                            <button className="tx-action-btn"><Trash2 size={12} /> Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default PatientDetailsPage;
