import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
jest.mock('lucide-react', () => ({
    Mail: () => <svg data-testid="mail-icon" />,
    EyeOff: () => <svg data-testid="eye-off-icon" />,
    Eye: () => <svg data-testid="eye-icon" />
}));

describe('Login Component', () => {
    // Helper function to render component with router context
    const renderWithRouter = (ui) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    test('renders main titles and texts', () => {
        renderWithRouter(<Login />);
        // Use regex for text that might be broken by <br /> or other child elements
        expect(screen.getByText(/Gestión Dental/i)).toBeInTheDocument();
        expect(screen.getByText(/Inteligente/i)).toBeInTheDocument();
        expect(screen.getByText(/Bienvenido de nuevo/i)).toBeInTheDocument();
        expect(screen.getByText(/Ingresa tus credenciales para acceder a tu panel/i)).toBeInTheDocument();
    });

    test('renders the login form fields', () => {
        renderWithRouter(<Login />);

        // Use regex for labels that contain spans like the required indicator (*)
        expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('ejemplo@correo.com')).toBeInTheDocument();

        expect(screen.getByText(/Contraseña/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    test('renders the submit button', () => {
        renderWithRouter(<Login />);

        const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
        expect(submitButton).toBeInTheDocument();
    });
});
