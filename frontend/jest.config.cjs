module.exports = {
    // Usar jsdom para simular el DOM del navegador en los tests
    testEnvironment: 'jsdom',

    // Transpilar JSX y ESM con Babel
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },

    // Reemplazar importaciones de archivos estáticos (CSS, SVG, imágenes)
    // con un stub vacío para que Jest no falle al encontrarlos
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.cjs',
        '\\.(svg|png|jpg|jpeg|gif|webp|ico)$': '<rootDir>/__mocks__/fileMock.cjs',
    },
};
