import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EditPatientPage from './EditPatientPage';
import patientsService from '../services/patientsService';

jest.mock('../services/patientsService', () => ({
    getPatientById: jest.fn(),
    updatePatient: jest.fn()
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => {
        return {
            t: (str) => {
                // Return a fallback for specific keys, else return the key itself so we can target it.
                if (str === 'common.loading') return 'Cargando...';
                if (str === 'common.save') return 'Guardar Cambios';
                return str; 
            },
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
}));

const renderWithRouter = (ui, route = '/patients/123/edit') => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                <Route path="/patients/:id/edit" element={ui} />
            </Routes>
        </MemoryRouter>
    );
};

describe('EditPatientPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('muestra estado de carga inicialmente', () => {
        patientsService.getPatientById.mockImplementation(() => new Promise(() => { }));
        renderWithRouter(<EditPatientPage />);
        expect(screen.getByText('Cargando...')).toBeInTheDOM;
    });

    it('renderiza la información del paciente correctamente en los inputs', async () => {
        const mockPatient = {
            _id: '123',
            nombre: 'Juan Pérez',
            cedula: 'V-12345678',
            fechaNacimiento: '1990-01-01T00:00:00.000Z',
            genero: 'Masculino',
            telefono: '04121234567',
            email: 'juan@test.com',
            direccion: 'Call 123',
            tipoSangre: 'O+',
            alergias: 'Ninguna',
            condicionesMedicas: '',
            notasAdicionales: ''
        };

        patientsService.getPatientById.mockResolvedValue(mockPatient);

        renderWithRouter(<EditPatientPage />);

        // Esperar a que la información asíncrona cargue y se muestre en los values
        await waitFor(() => {
            expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDOM;
            expect(screen.getByDisplayValue('V-12345678')).toBeInTheDOM;
            expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDOM;
            expect(screen.getByDisplayValue('juan@test.com')).toBeInTheDOM;
            expect(screen.getByDisplayValue('Call 123')).toBeInTheDOM;
        });
    });

    it('Llama updatePatient con los datos correctos on submit', async () => {
        const mockPatient = {
            _id: '123',
            nombre: 'Juan Pérez',
            cedula: 'V-12345678',
            fechaNacimiento: '1990-01-01T00:00:00.000Z',
            genero: 'Masculino',
            telefono: '04121234567',
            email: 'juan@test.com',
            direccion: 'Call 123',
            tipoSangre: 'O+',
            alergias: 'Ninguna',
            condicionesMedicas: '',
            notasAdicionales: ''
        };

        patientsService.getPatientById.mockResolvedValue(mockPatient);
        patientsService.updatePatient.mockResolvedValue({ ...mockPatient, nombre: 'Juan Update' });

        renderWithRouter(<EditPatientPage />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDOM;
        });

        // Cambiar campo Nombre
        const nombreInput = screen.getByDisplayValue('Juan Pérez');
        fireEvent.change(nombreInput, { target: { name: 'nombre', value: 'Juan Update' } });

        // Submit form
        const submitBtn = screen.getByRole('button', { name: /Guardar Cambios/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(patientsService.updatePatient).toHaveBeenCalledWith('123', expect.objectContaining({
                nombre: 'Juan Update'
            }));
        });
    });
});
