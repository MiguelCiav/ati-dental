module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  testTimeout: 30000,
  verbose: true,
  maxWorkers: 1,
  globalTeardown: './jest.teardown.js',
  forceExit: true
};
