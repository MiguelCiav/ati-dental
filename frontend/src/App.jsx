import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import { Modal, InputField, Button, Card } from './components'
import { Mail, Lock, Plus, LogIn } from 'lucide-react'
import ProfilePage from './profile/ProfileLanguage'
import './App.css'
import Login from './auth/Login'
import PatientsPage from './patients/PatientsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/patients" replace />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="patients/register" element={<RegisterPatientPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  )
}

const RegisterPatientPage = () => (
  <div className="page-container">
    <div className="page-header">
      <h1>Registrar Paciente</h1>
      <p>Formulario de registro de pacientes.</p>
    </div>
  </div>
)

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
    <div>
      <Card
        title="Información Personal"
        icon={User}
        headerAction={
          <Button variant="outline" size="small" icon={Edit}>
            Editar
          </Button>
        }
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


const ContactPage = () => (
  <div className="page-container">
    <div className="page-header">
      <h1>Contacto</h1>
      <p>Información de contacto.</p>
    </div>
  </div>
)

export default App
