import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileLanguage from './ProfileLanguage';

describe('ProfileLanguage Component', () => {
    it('renders the interface language card correctly', () => {
        render(<ProfileLanguage />);

        // Verifica que el título y la descripción estén presentes
        expect(screen.getByText('Idioma de la Interfaz')).toBeInTheDocument();
        expect(screen.getByText('Selecciona el idioma preferido para la interfaz del sistema ATI Dental.')).toBeInTheDocument();

        // Verifica que las opciones de idioma estén presentes
        expect(screen.getByText('Español')).toBeInTheDocument();
        expect(screen.getByText('English (Inglés)')).toBeInTheDocument();
    });

    it('sets Spanish as the default selected language', () => {
        const { container } = render(<ProfileLanguage />);

        // Busca las tarjetas de opción
        const spanishCard = screen.getByText('Español').closest('.language-option-card');
        const englishCard = screen.getByText('English (Inglés)').closest('.language-option-card');

        // Verifica que la clase 'selected' esté solo en español por defecto
        expect(spanishCard).toHaveClass('selected');
        expect(englishCard).not.toHaveClass('selected');
    });

    it('changes the selected language to English when clicked', () => {
        render(<ProfileLanguage />);

        const englishCard = screen.getByText('English (Inglés)').closest('.language-option-card');
        const spanishCard = screen.getByText('Español').closest('.language-option-card');

        // Hace clic en la opción de inglés
        fireEvent.click(englishCard);

        // Verifica que el estado cambie
        expect(englishCard).toHaveClass('selected');
        expect(spanishCard).not.toHaveClass('selected');
    });
});
