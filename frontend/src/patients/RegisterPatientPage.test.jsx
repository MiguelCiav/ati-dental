import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPatientPage from './RegisterPatientPage';

// Map of i18n keys → Spanish values (matches es/common.json)
const translations = {
    'registerPatient.title': 'Nuevo Paciente',
    'registerPatient.subtitle': 'Complete el formulario para registrar un nuevo paciente en el sistema.',
    'registerPatient.personalData': 'Datos Personales',
    'registerPatient.fullName': 'Nombre Completo',
    'registerPatient.fullNamePlaceholder': 'Ej. Juan Pérez',
    'registerPatient.idCard': 'Cédula de Identidad',
    'registerPatient.birthDate': 'Fecha de Nacimiento',
    'registerPatient.gender': 'Género',
    'registerPatient.phone': 'Teléfono',
    'registerPatient.email': 'Correo Electrónico',
    'registerPatient.emailPlaceholder': 'correo@ejemplo.com',
    'registerPatient.address': 'Dirección de Residencia',
    'registerPatient.addressPlaceholder': 'Calle, Número, Ciudad',
    'registerPatient.selectOption': 'Seleccionar...',
    'registerPatient.male': 'Masculino',
    'registerPatient.female': 'Femenino',
    'registerPatient.clinicalInfo': 'Información Clínica Básica',
    'registerPatient.bloodType': 'Tipo de Sangre',
    'registerPatient.allergies': 'Alergias Conocidas',
    'registerPatient.medicalConditions': 'Condiciones Médicas Previas',
    'registerPatient.additionalNotes': 'Notas Adicionales',
    'registerPatient.cancel': 'Cancelar',
    'registerPatient.save': 'Guardar Paciente',
    'registerPatient.saving': 'Guardando...',
    'registerPatient.errorDefault': 'Error al registrar el paciente',
};

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => translations[key] ?? key, i18n: { language: 'es' } })
}));

jest.mock('../services/patientsService', () => ({
    createPatient: jest.fn()
}));

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('RegisterPatientPage Component', () => {
    it('renders the form correctly', () => {
        renderWithRouter(<RegisterPatientPage />);

        expect(screen.getByText('Nuevo Paciente')).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre Completo/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Cédula de Identidad/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Correo Electrónico/)).toBeInTheDocument();
    });

    it('validates required fields on submit', async () => {
        renderWithRouter(<RegisterPatientPage />);

        // El browser nativamente previene submit si los form elements requeridos están vacíos,
        // Aquí solo verificamos que los campos requeridos tengan la propiedad correctly.
        expect(screen.getByLabelText(/Nombre Completo/)).toBeRequired();
        expect(screen.getByLabelText(/Correo Electrónico/)).toBeRequired();
    });
});
