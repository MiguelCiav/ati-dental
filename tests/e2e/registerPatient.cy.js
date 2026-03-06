describe('Registrar Paciente (US-07)', () => {
    beforeEach(() => {
        // Login before accessing protected routes
        cy.visit('/login');
        cy.get('input[name="email"]').type('admin@atidental.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/patients');
    });

    it('Debe permitir registrar un nuevo paciente con datos válidos', () => {
        cy.visit('/patients/register');

        // Validar el título
        cy.contains('h1', 'Nuevo Paciente').should('be.visible');

        // Llenar los campos requeridos y opcionales con datos únicos para cada test run
        const testId = new Date().getTime();
        cy.get('input[name="nombre"]').type('Cypress Test Patient');
        cy.get('input[name="cedula"]').type(`V-${testId}`);
        cy.get('input[name="fechaNacimiento"]').type('1990-01-01');
        cy.get('select[name="genero"]').select('Masculino');
        cy.get('input[name="telefono"]').type('04121234567');
        cy.get('input[name="email"]').type(`cypresstest+${testId}@example.com`);
        cy.get('input[name="direccion"]').type('Calle Falsa 123');

        // Información Clínica Básica
        cy.get('select[name="tipoSangre"]').select('O+');
        cy.get('textarea[name="alergias"]').type('Penicilina');
        cy.get('textarea[name="condicionesMedicas"]').type('Ninguna');
        cy.get('textarea[name="notasAdicionales"]').type('Paciente de prueba E2E');

        // Enviar el formulario
        cy.contains('button', 'Guardar Paciente').click();

        // Comprobar redirección al listado de pacientes
        cy.url().should('match', /\/patients$/);
    });
});
