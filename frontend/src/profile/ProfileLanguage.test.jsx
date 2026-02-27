import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '../context/AuthContext';
import ProfileLanguage from './ProfileLanguage';

// Mock react-i18next para evitar la necesidad de inicializar i18n completo
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        // i18next devuelve el defaultValue (2do arg) cuando no hay traducción cargada
        t: (key, defaultValue) => defaultValue || key,
        i18n: {
            language: 'es',
            changeLanguage: jest.fn(),
        },
    }),
}));

describe('ProfileLanguage Component', () => {
    const renderWithProviders = (ui) => {
        return render(<AuthProvider>{ui}</AuthProvider>);
    };

    it('renders the interface language card correctly', () => {
        renderWithProviders(<ProfileLanguage />);

        // Verifica que el título y la descripción estén presentes
        expect(screen.getByText('Idioma de la Interfaz')).toBeInTheDocument();
        expect(screen.getByText('Selecciona el idioma preferido para la interfaz del sistema ATI Dental.')).toBeInTheDocument();

        // Verifica que las opciones de idioma estén presentes
        expect(screen.getByText('Español')).toBeInTheDocument();
        expect(screen.getByText('English (Inglés)')).toBeInTheDocument();
    });

    it('sets Spanish as the default selected language', () => {
        const { container } = renderWithProviders(<ProfileLanguage />);

        // Busca las tarjetas de opción
        const spanishCard = screen.getByText('Español').closest('.language-option-card');
        const englishCard = screen.getByText('English (Inglés)').closest('.language-option-card');

        // Verifica que la clase 'selected' esté solo en español por defecto
        expect(spanishCard).toHaveClass('selected');
        expect(englishCard).not.toHaveClass('selected');
    });

    it('changes the selected language to English when clicked', () => {
        renderWithProviders(<ProfileLanguage />);

        const englishCard = screen.getByText('English (Inglés)').closest('.language-option-card');
        const spanishCard = screen.getByText('Español').closest('.language-option-card');

        // Hace clic en la opción de inglés
        fireEvent.click(englishCard);

        // Verifica que el estado cambie
        expect(englishCard).toHaveClass('selected');
        expect(spanishCard).not.toHaveClass('selected');
    });
});
