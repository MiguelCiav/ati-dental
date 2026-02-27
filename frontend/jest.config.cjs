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
    },

    // Ejecutar archivo de setup antes de cada test para polyfills
    setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
};
