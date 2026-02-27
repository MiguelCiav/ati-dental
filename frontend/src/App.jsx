import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import { Modal, InputField, Button, Card, ProtectedRoute } from './components'
import { Mail, Lock, Plus, LogIn } from 'lucide-react'
import ProfilePage from './profile/ProfileLanguage'
import './App.css'
import Login from './auth/Login'
import PatientsPage from './patients/PatientsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/patients" replace />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="patients/register" element={<RegisterPatientPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
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

const ContactPage = () => (
  <div className="page-container">
    <div className="page-header">
      <h1>Contacto</h1>
      <p>Información de contacto.</p>
    </div>
  </div>
)

export default App
