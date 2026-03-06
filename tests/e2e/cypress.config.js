const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://frontend',

    specPattern: '*.cy.js',

    supportFile: false,

    video: false,

    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium' || browser.name === 'electron') {
          // mac/linux
          launchOptions.args.push('--lang=es-ES,es');

          // some headless versions need this ENV var
          launchOptions.preferences.default_language = 'es';
          launchOptions.preferences.intl = { accept_languages: 'es-ES,es' };
        }
        return launchOptions;
      });
    },
  },
});