module.exports = {
    // Usar jsdom para simular el DOM del navegador en los tests
    testEnvironment: 'jsdom',

    // Transpilar JSX y ESM con nuestro transformer personalizado
    // que reemplaza import.meta.env → process.env antes de Babel
    transform: {
        '^.+\\.[jt]sx?$': '<rootDir>/jest.transform.cjs',
    },

    // Reemplazar importaciones de archivos estáticos (CSS, SVG, imágenes)
    // con un stub vacío para que Jest no falle al encontrarlos
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.cjs',
        '\\.(svg|png|jpg|jpeg|gif|webp|ico)$': '<rootDir>/__mocks__/fileMock.cjs',
        '^recharts$': '<rootDir>/__mocks__/rechartsMock.cjs',
        '^lucide-react$': '<rootDir>/__mocks__/lucideMock.cjs',
        '^jspdf$': '<rootDir>/__mocks__/jspdfMock.cjs',
        '^html2canvas$': '<rootDir>/__mocks__/html2canvasMock.cjs'
    },

    // Ejecutar archivo de setup antes de cada test para polyfills
    setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],

    // Permitir la transpilación de ciertos módulos ESM que Jest ignora por defecto en node_modules
    transformIgnorePatterns: [
        'node_modules/(?!(jspdf|fflate|react-i18next|i18next|recharts|d3-.*)/)'
    ],
};
