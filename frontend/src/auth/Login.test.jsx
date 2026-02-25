import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
jest.mock('lucide-react', () => ({
    Mail: () => <svg data-testid="mail-icon" />,
    EyeOff: () => <svg data-testid="eye-off-icon" />
}));

describe('Login Component', () => {
    // Helper function to render component with router context
    const renderWithRouter = (ui) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    test('renders main titles and texts', () => {
        renderWithRouter(<Login />);
        expect(screen.getByText('Gestión Dental')).toBeInTheDocument();
        expect(screen.getByText('Inteligente')).toBeInTheDocument();
        expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument();
        expect(screen.getByText('Ingresa tus credenciales para acceder a tu panel')).toBeInTheDocument();
    });

    test('renders the login form fields', () => {
        renderWithRouter(<Login />);

        // Use placeholders or labels to find the inputs
        expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('ejemplo@correo.com')).toBeInTheDocument();

        expect(screen.getByText('Contraseña')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    test('renders the submit button and links', () => {
        renderWithRouter(<Login />);

        const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
        expect(submitButton).toBeInTheDocument();

        const forgotPasswordLink = screen.getByRole('link', { name: /¿Olvidaste tu contraseña\?/i });
        expect(forgotPasswordLink).toBeInTheDocument();
        expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');

        const registerLink = screen.getByRole('link', { name: /Registrarse/i });
        expect(registerLink).toBeInTheDocument();
        expect(registerLink).toHaveAttribute('href', '/register');
    });
});
