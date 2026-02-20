const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://frontend', 
    setupNodeEvents(on, config) {},
    video: false, 
  },
});