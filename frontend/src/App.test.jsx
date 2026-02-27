import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        // Smoke test: verifica que el componente principal monta sin lanzar errores
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        expect(document.body).toBeTruthy();
    });
});
