/**
 * Transformer personalizado para Jest que reemplaza import.meta.env
 * por process.env antes de que Babel procese el archivo.
 *
 * Vite usa import.meta.env para variables de entorno, pero Jest
 * no soporta import.meta en modo CommonJS. Este transformer
 * hace el reemplazo a nivel de texto, evitando cualquier problema
 * de parsing de Babel.
 */
module.exports = {
    process(sourceText, sourcePath, options) {
        // Reemplazar import.meta.env.XXX por process.env.XXX
        const transformed = sourceText.replace(
            /import\.meta\.env\.(\w+)/g,
            'process.env.$1'
        ).replace(
            // Caso: import.meta.env (sin propiedad específica)
            /import\.meta\.env/g,
            'process.env'
        );

        // Delegar el resto de la transformación a babel-jest
        const babelJest = require('babel-jest').default || require('babel-jest');
        const transformer = babelJest.createTransformer();
        return transformer.process(transformed, sourcePath, options);
    },
};
