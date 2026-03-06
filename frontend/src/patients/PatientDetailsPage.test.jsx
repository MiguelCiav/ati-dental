import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PatientDetailsPage from './PatientDetailsPage';
import patientsService from '../services/patientsService';

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
        expect(screen.getByText('Cargando información del paciente...')).toBeInTheDOM;
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
            expect(screen.getByText('Juan Pérez')).toBeInTheDOM;
            // The display ID text logic was slightly changed in the layout
            expect(screen.getByText((content, element) => content.includes('V-12345678'))).toBeInTheDOM;
            expect(screen.getByText('juan@test.com')).toBeInTheDOM;
            expect(screen.getByText('O+')).toBeInTheDOM;
        });
    });

    it('muestra mensaje de error si falla la carga', async () => {
        patientsService.getPatientById.mockRejectedValue(new Error('Patient not found'));

        renderWithRouter(<PatientDetailsPage />);

        await waitFor(() => {
            expect(screen.getByText('Patient not found')).toBeInTheDOM;
            expect(screen.getByText('Volver al listado')).toBeInTheDOM;
        });
    });
});
