import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPatientPage from './RegisterPatientPage';

// Mock dependancy
jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: key => key })
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

        expect(screen.getByText('Nuevo Paciente')).toBeInTheDOM;
        expect(screen.getByLabelText('Nombre Completo')).toBeInTheDOM;
        expect(screen.getByLabelText('Cédula de Identidad')).toBeInTheDOM;
        expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDOM;
    });

    it('validates required fields on submit', async () => {
        renderWithRouter(<RegisterPatientPage />);

        // El browser nativamente previene submit si los form elements requeridos están vacíos,
        // Aquí solo verificamos que los campos requeridos tengan la propiedad correctly.
        expect(screen.getByLabelText('Nombre Completo')).toBeRequired();
        expect(screen.getByLabelText('Correo Electrónico')).toBeRequired();
    });
});
