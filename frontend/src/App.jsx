import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import { Modal, InputField, Button, Card } from './components'
import { Mail, Lock, Plus, LogIn } from 'lucide-react'
import ProfilePage from './profile/ProfileLanguage'
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



const ContactPage = () => (
  <div className="page-container">
    <h1>Contacto</h1>
    <p>Información de contacto.</p>
  </div>
)

export default App
