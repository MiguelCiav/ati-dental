import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // Carga diccionarios desde /public/locales/{{lng}}/{{ns}}.json
    .use(Backend)
    // Detecta el idioma del navegador por defecto o guárdalo
    .use(LanguageDetector)
    // Pasa la instancia de i18n a react-i18next
    .use(initReactI18next)
    // Configuración de inicialización
    .init({
        fallbackLng: 'es', // Idioma de reserva
        debug: false,      // Cambiar a true si necesitas depurar en consola

        // Opciones para la detección si el usuario no tiene preferencias del backend guardadas
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },

        interpolation: {
            escapeValue: false, // React ya previene XSS por lo que no necesitamos esto
        }
    });

export default i18n;
