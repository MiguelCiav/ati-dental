describe('Consultar Ficha de Paciente (US-08)', () => {
    beforeEach(() => {
        // Login before accessing protected routes
        cy.visit('/login');
        cy.get('input[name="email"]').type('admin@atidental.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/patients');
    });

    it('Debe visualizar la información detallada del paciente y volver manteniendo estado', () => {
        // 1. Ir a la lista de pacientes
        cy.visit('/patients');

        // Carga inicial
        cy.get('[data-testid="patient-row"]', { timeout: 10000 }).should('exist');

        // 2. Aplicar un filtro (ej: buscar por nombre) para validar la retención
        cy.get('input[placeholder*="Nombre, apellido o ID"]').type('María');
        cy.wait(1000); // debounce

        // 3. Obtener el nombre del primer resultado mostrado y hacer click en ver
        cy.get('[data-testid="patient-name"]').first().invoke('text').then((patientName) => {

            cy.get('[data-testid="view-patient-btn"]').first().click();

            // 4. Validar que la URL cambió y estamos en la vista de detalle
            cy.url().should('match', /\/patients\/[a-zA-Z0-9]+$/);
            cy.contains('h1', patientName).should('be.visible');
            cy.contains('Información Personal').should('be.visible');
            cy.contains('Información Clínica Básica').should('be.visible');

            // 5. Volver a la lista de pacientes usando el botón atrás del navegador
            cy.go('back');

            // 6. Validar que la URL es `/patients` y que los pacientes se cargan correctamente
            cy.url().should('match', /\/patients$/);
            cy.get('[data-testid="patient-row"]', { timeout: 10000 }).should('exist');
        });
    });
});
