import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import { Modal, InputField, Button, Card } from './components'
import { Mail, Lock, Plus, LogIn, User, Phone, Edit } from 'lucide-react'
import './App.css'

function App() {
  return (
    <Routes>
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

const PatientsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Listado de Pacientes</h1>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Nuevo Paciente
        </Button>
      </div>
      
      <p style={{ marginBottom: '32px', color: '#666' }}>Aquí se mostrará el listado de pacientes.</p>

      <div style={{ maxWidth: '500px' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Ejemplo de Componentes</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <InputField
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            icon={Mail}
          />

          <InputField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
            helperText="¿Olvidaste tu contraseña?"
          />

          <InputField
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John"
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button variant="primary" fullWidth>
              Iniciar Sesión
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" fullWidth>
              Google
            </Button>
            <Button variant="secondary" fullWidth>
              Microsoft
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ejemplo de Modal con Formulario"
        size="medium"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Guardar
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <InputField
            label="Correo Electrónico"
            type="email"
            placeholder="ejemplo@correo.com"
            icon={Mail}
          />
          <InputField
            label="Nombre Completo"
            placeholder="John Smith"
            required
          />
        </div>
      </Modal>
    </div>
  );
}

const RegisterPatientPage = () => (
  <div className="page-container">
    <h1>Registrar Paciente</h1>
    <p>Formulario de registro de pacientes.</p>
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
    </div>
  );
}

const ContactPage = () => (
  <div className="page-container">
    <h1>Contacto</h1>
    <p>Información de contacto.</p>
  </div>
)

export default App
