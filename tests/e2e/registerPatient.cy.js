describe('Registrar Paciente (US-07)', () => {
    it('Debe permitir registrar un nuevo paciente con datos válidos', () => {
        // 1. Ir al dashboard principal (asumiendo que inicia sesión automáticamente en entorno test o mock)
        // Para simplificar, vamos directo a la ruta
        cy.visit('/patients/register');

        // Validar el título
        cy.contains('h1', 'Nuevo Paciente').should('be.visible');

        // Llenar los campos requeridos y opcionales
        cy.get('input[name="nombre"]').type('Cypress Test Patient');
        cy.get('input[name="cedula"]').type('V-12345678');
        cy.get('input[name="fechaNacimiento"]').type('1990-01-01');
        cy.get('select[name="genero"]').select('Otro');
        cy.get('input[name="telefono"]').type('04121234567');
        cy.get('input[name="email"]').type('cypresstest@example.com');
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
