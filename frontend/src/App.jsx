import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import { Modal, InputField, Button, Card, ProtectedRoute } from './components'
import { Mail, Lock, Plus, LogIn } from 'lucide-react'
import ProfilePage from './profile/ProfileLanguage'
import { useTranslation } from 'react-i18next'
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

const RegisterPatientPage = () => {
  const { t } = useTranslation('common');
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('menu.registerPatient', 'Registrar Paciente')}</h1>
        <p>{t('menu.registerPatientHint', 'Formulario de registro de pacientes.')}</p>
      </div>
    </div>
  );
}

const ContactPage = () => {
  const { t } = useTranslation('common');
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{t('menu.contact', 'Contacto')}</h1>
        <p>{t('menu.contactHint', 'Información de contacto.')}</p>
      </div>
    </div>
  );
}

export default App
