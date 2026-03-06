describe('Preferencia de Idioma en Perfil', () => {
    beforeEach(() => {
        // En una prueba completa de E2E, nos aseguramos de estar logueados si la ruta lo requiere.
        // Si el sistema no requiere login en ambiente de prueba, simplemente visitamos la ruta.
        cy.visit('/profile');
    });

    it('Carga la página de perfil con las opciones de idioma', () => {
        // Puede estar en español o inglés por defecto
        cy.get('.language-options-grid', { timeout: 10000 }).should('be.visible');
        cy.contains('Español').should('be.visible');
        cy.contains('English (Inglés)').should('be.visible');
    });

    it('Cambia el idioma a Inglés y verifica la persistencia', () => {
        cy.visit('/profile');

        // Esperamos a que la página cargue, puede estar en es o en
        cy.get('.language-options-grid', { timeout: 10000 }).should('exist');

        // Seleccionamos la tarjeta de Inglés
        cy.contains('English (Inglés)').click();

        // Buscamos el botón de guardar. Dependiendo del idioma actual, puede decir "Guardar Cambios" o "Save Changes"
        // Hacemos click en el botón `primary` que es el de guardar
        cy.get('button').contains(/(Guardar Cambios|Save Changes)/).click();

        // Validar que el mensaje de éxito aparece (en el nuevo idioma o en el viejo dependiendo del timing)
        cy.contains(/(Perfil guardado exitosamente\.|Profile saved successfully\.)/, { timeout: 5000 }).should('be.visible');

        // Después del éxito, la interfaz debe estar en inglés
        cy.contains('Save Changes').should('be.visible');
        cy.contains('Personal Information').should('be.visible');

        // Recargamos la página para validar persistencia
        cy.reload();

        // Verificamos que se mantiene en inglés
        cy.contains('Save Changes', { timeout: 10000 }).should('be.visible');
        cy.contains('Personal Information').should('be.visible');

        // Restaurar estado a Español para no afectar otras pruebas
        cy.contains('Español').click();
        cy.contains('Save Changes').click();

        // Mensaje de éxito asumiendo que ya estaba en inglés antes de clickear
        cy.contains('Profile saved successfully.', { timeout: 5000 }).should('be.visible');

        // Validar que volvió a español
        cy.contains('Guardar Cambios').should('be.visible');
    });
});
