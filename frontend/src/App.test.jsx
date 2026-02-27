import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        // Smoke test: verifica que el componente principal monta sin lanzar errores
        render(
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        );
        expect(document.body).toBeTruthy();
    });
});
