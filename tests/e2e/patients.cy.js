describe('Listado de Pacientes - Búsqueda y Filtrado', () => {
    beforeEach(() => {
        // Visitar la página de pacientes antes de cada test
        cy.visit('/patients');
    });

    it('Debe mostrar el título y subtítulo de la página', () => {
        cy.contains('h1', 'Listado de Pacientes').should('be.visible');
        cy.contains('Gestiona y consulta el historial de todos tus pacientes').should('be.visible');
    });

    it('Debe cargar y mostrar la lista de pacientes', () => {
        // Esperar a que se carguen los pacientes
        cy.get('[data-testid="patient-row"]', { timeout: 10000 })
            .should('have.length.greaterThan', 0);
    });

    it('Usuario escribe "González" en el buscador → Presiona Enter → La tabla solo muestra a María González', () => {
        // Esperar a que cargue la lista inicial
        cy.get('[data-testid="patient-row"]', { timeout: 10000 }).should('exist');

        // Encontrar el campo de búsqueda y escribir
        cy.get('input[placeholder*="Nombre, apellido o ID"]')
            .type('González');

        // Presionar Enter
        cy.get('input[placeholder*="Nombre, apellido o ID"]')
            .type('{enter}');

        // Esperar a que se actualice la lista (debounce de 500ms)
        cy.wait(1000);

        // Verificar que solo aparece María González
        cy.get('[data-testid="patient-row"]')
            .should('have.length', 1);

        cy.contains('María González').should('be.visible');
    });

    it('Usuario escribe "Carlos" → Espera 500ms → La tabla se actualiza automáticamente', () => {
        // Esperar a que cargue la lista inicial
        cy.get('[data-testid="patient-row"]', { timeout: 10000 }).should('exist');

        // Escribir en el campo de búsqueda
        cy.get('input[placeholder*="Nombre, apellido o ID"]')
            .type('Carlos');

        // Esperar el debounce (500ms) + tiempo de procesamiento
        cy.wait(1000);

        // Verificar que se filtró correctamente
        cy.contains('Carlos Ruiz').should('be.visible');
        cy.contains('María González').should('not.exist');
    });

    it('Usuario cambia el orden a "Nombre (A-Z)" → La lista se reordena alfabéticamente', () => {
        // Esperar a que cargue la lista inicial
        cy.get('[data-testid="patient-row"]', { timeout: 10000 }).should('exist');

        // Cambiar el orden usando el select
        cy.get('select').select('nombre-asc');

        // Esperar un momento para que se reordene
        cy.wait(500);

        // Obtener todos los nombres y verificar que están en orden alfabético
        cy.get('[data-testid="patient-name"]')
            .then($names => {
                const names = [...$names].map(el => el.textContent);
                const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
                expect(names).to.deep.equal(sortedNames);
            });
    });

    it('Usuario borra el texto de búsqueda → La tabla muestra todos los pacientes', () => {
        // Esperar a que cargue la lista inicial
        cy.get('[data-testid="patient-row"]', { timeout: 10000 }).should('exist');

        const initialCount = cy.get('[data-testid="patient-row"]').its('length');

        // Escribir algo en el buscador
        cy.get('input[placeholder*="Nombre, apellido o ID"]')
            .type('María');

        cy.wait(1000);

        // Verificar que se filtró
        cy.get('[data-testid="patient-row"]')
            .should('have.length.lessThan', 5);

        // Limpiar el campo de búsqueda
        cy.get('input[placeholder*="Nombre, apellido o ID"]')
            .clear();

        // Esperar el debounce
        cy.wait(1000);

        // Verificar que se muestran todos los pacientes nuevamente
        cy.get('[data-testid="patient-row"]')
            .should('have.length.greaterThan', 1);
    });

    it('Debe mostrar mensaje "No se encontraron pacientes" cuando no hay resultados', () => {
        // Esperar a que cargue la lista inicial
        cy.get('[data-testid="patient-row"]', { timeout: 10000 }).should('exist');

        // Buscar algo que no existe
        cy.get('input[placeholder*="Nombre, apellido o ID"]')
            .type('XYZ123NoExiste');

        cy.wait(1000);

        // Verificar mensaje de lista vacía
        cy.contains('No se encontraron pacientes').should('be.visible');
    });

    it('Debe poder ver los detalles de un paciente al hacer clic en el ícono de ojo', () => {
        // Esperar a que cargue la lista
        cy.get('[data-testid="patient-row"]', { timeout: 10000 }).should('exist');

        // Hacer clic en el primer botón de ver
        cy.get('[data-testid="view-patient-btn"]').first().click();

        // Aquí se debería abrir un modal o navegar a detalles
        // Ajustar según la implementación real
    });

    it('Los botones de acción deben ser visibles y clicables', () => {
        // Esperar a que cargue la lista
        cy.get('[data-testid="patient-row"]', { timeout: 10000 }).should('exist');

        // Verificar que los botones de ver y editar existen
        cy.get('[data-testid="view-patient-btn"]').should('be.visible');
        cy.get('[data-testid="edit-patient-btn"]').should('be.visible');
    });
});

