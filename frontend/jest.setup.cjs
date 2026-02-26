const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// Polyfills mínimos para fetch, Request y Response si no están definidos por jsdom
if (typeof global.Request === 'undefined') {
    global.Request = class Request { };
}
if (typeof global.Response === 'undefined') {
    global.Response = class Response { };
}
if (typeof global.fetch === 'undefined') {
    global.fetch = jest.fn(() => Promise.resolve());
}

// Importar jest-dom globalmente para no tener que hacerlo en cada archivo de test
require('@testing-library/jest-dom');
