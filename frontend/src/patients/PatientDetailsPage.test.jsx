import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PatientDetailsPage from './PatientDetailsPage';
import patientsService from '../services/patientsService';

// Map of i18n keys → Spanish values (matches es/common.json)
const translations = {
    'patientDetails.loadingPatient': 'Cargando información del paciente...',
    'patientDetails.patientNotFound': 'No se encontró el paciente solicitado.',
    'patientDetails.backToList': 'Volver al listado',
    'patientDetails.breadcrumbPatients': 'Pacientes',
    'patientDetails.breadcrumbDetails': 'Ficha del Paciente',
    'patientDetails.editBtn': 'Editar',
    'patientDetails.newAppointmentBtn': 'Nueva Cita',
    'patientDetails.personalInfo': 'Información Personal',
    'patientDetails.email': 'Correo Electrónico',
    'patientDetails.address': 'Dirección',
    'patientDetails.notSpecified': 'No especificado',
    'patientDetails.notSpecifiedFem': 'No especificada',
    'patientDetails.clinicalInfo': 'Información Clínica Básica',
    'patientDetails.bloodType': 'Tipo de Sangre',
    'patientDetails.allergies': 'Alergias Conocidas',
    'patientDetails.noneRegistered': 'Ninguna registrada',
    'patientDetails.medicalConditions': 'Condiciones Médicas Previas',
    'patientDetails.additionalNotes': 'Notas Adicionales',
    'patientDetails.none': 'Ninguna',
    'patientDetails.nextAppointment': 'PRÓXIMA CITA',
    'patientDetails.lastVisit': 'ÚLTIMA VISITA',
    'patientDetails.treatmentHistory': 'Historial de Tratamientos',
    'patientDetails.addTreatment': 'Añadir Tratamiento',
    'patientDetails.modifyTreatment': 'Modificar',
    'patientDetails.deleteTreatment': 'Eliminar',
    'patientDetails.years': 'años',
};

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => translations[key] ?? key, i18n: { language: 'es' } })
}));

jest.mock('../services/patientsService', () => ({
    getPatientById: jest.fn()
}));

const renderWithRouter = (ui, route = '/patients/123') => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                <Route path="/patients/:id" element={ui} />
            </Routes>
        </MemoryRouter>
    );
};

describe('PatientDetailsPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('muestra estado de carga inicialmente', () => {
        patientsService.getPatientById.mockImplementation(() => new Promise(() => { }));
        renderWithRouter(<PatientDetailsPage />);
        expect(screen.getByText('Cargando información del paciente...')).toBeInTheDocument();
    });

    it('renderiza la información del paciente correctamente', async () => {
        const mockPatient = {
            _id: '1234567890abcdef1234abcd',
            displayId: '#P-ABCD',
            nombre: 'Juan Pérez',
            cedula: 'V-12345678',
            email: 'juan@test.com',
            telefono: '04121234567',
            genero: 'Masculino',
            tipoSangre: 'O+',
            alergias: 'Ninguna'
        };

        patientsService.getPatientById.mockResolvedValue(mockPatient);

        renderWithRouter(<PatientDetailsPage />);

        await waitFor(() => {
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            expect(screen.getByText((content) => content.includes('V-12345678'))).toBeInTheDocument();
            expect(screen.getByText('juan@test.com')).toBeInTheDocument();
            expect(screen.getByText('O+')).toBeInTheDocument();
        });
    });

    it('muestra mensaje de error si falla la carga', async () => {
        patientsService.getPatientById.mockRejectedValue(new Error('Patient not found'));

        renderWithRouter(<PatientDetailsPage />);

        await waitFor(() => {
            expect(screen.getByText('Patient not found')).toBeInTheDocument();
            expect(screen.getByText('Volver al listado')).toBeInTheDocument();
        });
    });
});
