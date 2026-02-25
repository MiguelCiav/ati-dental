const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Request = Request;
global.Response = Response;

// Importar jest-dom globalmente para no tener que hacerlo en cada archivo de test
require('@testing-library/jest-dom');
