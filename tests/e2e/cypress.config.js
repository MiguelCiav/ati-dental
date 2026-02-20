const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://frontend', 
    
    specPattern: '*.cy.js',
    
    supportFile: false,
    
    video: false, 
  },
});