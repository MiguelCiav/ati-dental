describe('Editar Paciente (US-09)', () => {
    beforeEach(() => {
        // Login before accessing protected routes
        cy.visit('/login');
        cy.get('input[name="email"]').type('admin@atidental.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/patients');
    });

    it('Debe editar la información de un paciente y visualizar los cambios', () => {
        // 1. Ir a la lista de pacientes
        cy.visit('/patients');

        // Carga inicial
        cy.get('[data-testid="patient-row"]', { timeout: 10000 }).should('exist');

        // 2. Hacer click en "Ver Ficha" del primer paciente
        cy.get('[data-testid="view-patient-btn"]').first().click();

        // 3. Validar estar en la ficha y hacer click en Editar
        cy.url().should('match', /\/patients\/[a-zA-Z0-9]+$/);
        cy.contains('button', 'Editar').click();

        // 4. Validar que la URL cambió a la vista de edición
        cy.url().should('match', /\/patients\/[a-zA-Z0-9]+\/edit$/);
        cy.contains('h1', 'Editar Paciente').should('be.visible');

        // 5. Modificar un campo (ej: Dirección)
        cy.get('input[name="direccion"]').clear().type('Nueva Avenida 123');

        // 6. Guardar cambios
        cy.contains('button', 'Guardar').click();

        // 7. Validar redirección a la ficha del paciente
        cy.url().should('match', /\/patients\/[a-zA-Z0-9]+$/);

        // 8. Verificar que el campo modificado se visualiza correctamente
        cy.contains('Nueva Avenida 123').should('be.visible');
    });
});
