import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import { Modal } from './components'
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

  return (
    <div className="page-container">
      <h1>Listado de Pacientes</h1>
      <p>Aquí se mostrará el listado de pacientes.</p>
      
      <button 
        className="primary" 
        onClick={() => setIsModalOpen(true)}
        style={{ marginTop: '16px' }}
      >
        Ver ejemplo de Modal
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ejemplo de Modal"
        size="medium"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
            <button className="primary" onClick={() => setIsModalOpen(false)}>
              Aceptar
            </button>
          </>
        }
      >
        <p>Este es un modal genérico y reutilizable.</p>
        <p>Puedes personalizarlo con diferentes tamaños: small, medium, large, full.</p>
        <p>También puedes añadir cualquier contenido en el body y botones en el footer.</p>
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

const ProfilePage = () => (
  <div className="page-container">
    <h1>Perfil e Idioma</h1>
    <p>Configuración de perfil y preferencias de idioma.</p>
  </div>
)

const ContactPage = () => (
  <div className="page-container">
    <h1>Contacto</h1>
    <p>Información de contacto.</p>
  </div>
)

export default App
