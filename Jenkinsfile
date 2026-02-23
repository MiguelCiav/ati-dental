// =============================================================================
// Jenkinsfile — Pipeline CI/CD para ATI-Dental
//
// ARQUITECTURA:
//   - Jenkins corre en su propio contenedor (docker-compose.jenkins.yml)
//   - Este pipeline levanta el entorno de la app (docker-compose.yml)
//     con  -p ati-dental  para garantizar nombres de red predecibles.
//   - La red del entorno de pruebas siempre se llama: ati-dental_app-network
//   - Al finalizar, el contenedor de producción queda corriendo en el host.
// =============================================================================

pipeline {
    agent any

    environment {
        // Nombre del proyecto Compose → fija la red como ati-dental_app-network
        // sin importar el nombre de la carpeta donde esté el repositorio.
        COMPOSE_PROJECT = "ati-dental"
        APP_NETWORK     = "ati-dental_app-network"

        // Imágenes construidas durante el pipeline
        FRONTEND_BUILD_IMAGE = "frontend-app:build"
        FRONTEND_PROD_IMAGE  = "frontend-app:prod"
        API_TEST_IMAGE       = "ati-dental-api-test"
        E2E_IMAGE            = "ati-dental-e2e"
        PERF_IMAGE           = "ati-dental-perf"

        // Nombre del contenedor de producción que quedará corriendo
        PROD_CONTAINER = "prod-ati-dental"
    }

    stages {

        // -----------------------------------------------------------------------
        // 1. CHECKOUT
        // Descarga el código más reciente de la rama activa.
        // -----------------------------------------------------------------------
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // -----------------------------------------------------------------------
        // 2. VERIFICACIÓN DE DOCKER
        // Confirma que el daemon de Docker es accesible desde Jenkins.
        // -----------------------------------------------------------------------
        stage('Docker Check') {
            steps {
                sh 'docker version'
                sh 'docker compose version'
            }
        }

        // -----------------------------------------------------------------------
        // 3. BUILD FRONTEND (imagen de pruebas)
        // Construye la imagen con dependencias de desarrollo para correr Jest.
        // -----------------------------------------------------------------------
        stage('Build Frontend (dev)') {
            steps {
                sh """#!/bin/sh
                set -eux
                docker build \\
                    -f frontend/Dockerfile.build \\
                    -t ${FRONTEND_BUILD_IMAGE} \\
                    frontend
                """
            }
        }

        // -----------------------------------------------------------------------
        // 4. PRUEBAS UNITARIAS
        // Corre Jest dentro de la imagen de dev. El contenedor se destruye al
        // terminar (--rm) sin afectar nada más.
        // -----------------------------------------------------------------------
        stage('Unit Tests') {
            steps {
                echo '>>> [Unit Tests] Ejecutando pruebas unitarias con Jest...'
                sh "docker run --rm ${FRONTEND_BUILD_IMAGE} npm test"
                echo '>>> [Unit Tests] ✅ Todas las pruebas unitarias pasaron.'
            }
        }

        // -----------------------------------------------------------------------
        // 5. LEVANTAR ENTORNO DE INTEGRACIÓN
        // Construye y levanta TODOS los servicios (frontend, api, mongo) desde
        // cero con los cambios del checkout actual. El flag --build garantiza
        // que no se usen capas cacheadas del código anterior.
        // -----------------------------------------------------------------------
        stage('Levantar Entorno de Pruebas') {
            steps {
                echo '>>> Levantando entorno completo (frontend + api + mongo)...'
                sh """
                docker compose -p ${COMPOSE_PROJECT} -f docker-compose.yml \\
                    up -d --build --wait
                """
                // --wait espera a que todos los healthchecks pasen antes de continuar
                echo '>>> ✅ Entorno listo. Todos los servicios healthy.'
            }
        }

        // -----------------------------------------------------------------------
        // 6. PRUEBAS DE API (Newman / Postman)
        // Se conecta a la red del entorno de pruebas para alcanzar la API.
        // catchError → pipeline continúa marcado como UNSTABLE si hay fallos.
        // -----------------------------------------------------------------------
        stage('API Tests') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        sh "docker build -t ${API_TEST_IMAGE} -f tests/api/Dockerfile.test tests/api"
                        sh """
                        docker run --rm \\
                            --network ${APP_NETWORK} \\
                            ${API_TEST_IMAGE} \\
                            run collection.json
                        """
                        echo '>>> ✅ API Tests completados.'
                    }
                }
            }
        }

        // -----------------------------------------------------------------------
        // 7. PRUEBAS E2E (Cypress)
        // Cypress necesita resolución DNS interna → usa la misma red de la app.
        // catchError → idem que API Tests.
        // -----------------------------------------------------------------------
        stage('E2E Tests') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        sh "docker build -t ${E2E_IMAGE} -f tests/e2e/Dockerfile.e2e tests/e2e"
                        sh """
                        docker run --rm \\
                            --network ${APP_NETWORK} \\
                            ${E2E_IMAGE}
                        """
                        echo '>>> ✅ E2E Tests completados.'
                    }
                }
            }
        }

        // -----------------------------------------------------------------------
        // 8. PRUEBAS DE RENDIMIENTO (JMeter)
        // CORRECCIONES:
        //   - Conectado a la red de la app (antes estaba aislado).
        //   - Resultados guardados en un volumen bind-mount para que Jenkins
        //     los conserve aunque el contenedor se destruya con --rm.
        // catchError → idem.
        // -----------------------------------------------------------------------
        stage('Performance Tests') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        // Limpiar resultados anteriores para que JMeter no falle con
                        // "folder is not empty" en ejecuciones consecutivas del pipeline
                        sh 'rm -rf test-results/performance && mkdir -p test-results/performance'
                        sh "docker build -t ${PERF_IMAGE} -f tests/performance/Dockerfile.perf tests/performance"
                        sh """
                        docker run --rm \\
                            --network ${APP_NETWORK} \\
                            -v \$(pwd)/test-results/performance:/tests/results \\
                            ${PERF_IMAGE} \\
                            -n -t plan_de_pruebas.jmx -l results/resultados.jtl -e -o results/report
                        """
                        echo '>>> ✅ Pruebas de rendimiento completadas. Resultados en test-results/performance/'
                    }
                }
            }
        }

        // -----------------------------------------------------------------------
        // 9. BUILD FRONTEND DE PRODUCCIÓN
        // Compila la imagen optimizada (Nginx + assets estáticos).
        // Se construye después de que todos los tests pasan (o son UNSTABLE).
        // -----------------------------------------------------------------------
        stage('Build Frontend (prod)') {
            steps {
                sh """#!/bin/sh
                set -eux
                docker build \\
                    -f frontend/Dockerfile.prod \\
                    -t ${FRONTEND_PROD_IMAGE} \\
                    frontend
                """
            }
        }

        // -----------------------------------------------------------------------
        // 10. BAJAR ENTORNO DE PRUEBAS
        // Limpia los contenedores de prueba ANTES de desplegar producción para
        // liberar el puerto 8080 en el host.
        // -----------------------------------------------------------------------
        stage('Teardown Entorno de Pruebas') {
            steps {
                sh "docker compose -p ${COMPOSE_PROJECT} -f docker-compose.yml down"
                echo '>>> Entorno de pruebas eliminado.'
            }
        }

        // -----------------------------------------------------------------------
        // 11. DESPLIEGUE A PRODUCCIÓN
        // Arranca el frontend compilado en el puerto 8080 del host.
        // El contenedor se llama prod-ati-dental y NO se elimina al final
        // (queda accesible después del pipeline).
        // Puerto: 8080 del host → 80 del contenedor (Nginx)
        // -----------------------------------------------------------------------
        stage('Deploy Production') {
            steps {
                sh """#!/bin/sh
                set -ex

                # Detener y eliminar la versión anterior si existe
                docker stop ${PROD_CONTAINER} || true
                docker rm   ${PROD_CONTAINER} || true

                # Arrancar la nueva versión — el contenedor queda corriendo
                docker run -d \\
                    --name ${PROD_CONTAINER} \\
                    --restart unless-stopped \\
                    -p 8080:80 \\
                    ${FRONTEND_PROD_IMAGE}

                echo '>>> ✅ Producción desplegada en http://localhost:8080'
                """
            }
        }
    }

    // -----------------------------------------------------------------------
    // POST-PIPELINE
    // - always:  elimina únicamente las imágenes de build/test del pipeline.
    //            El contenedor de producción (prod-ati-dental) NO se toca.
    // - failure: si algo falla antes del teardown, garantiza que el entorno
    //            de pruebas quede limpio de todas formas.
    // -----------------------------------------------------------------------
    post {
        failure {
            // Si el pipeline explota antes del teardown explícito, bájalo igual
            sh "docker compose -p ${COMPOSE_PROJECT} -f docker-compose.yml down || true"
        }
        always {
            echo '>>> Limpiando imágenes intermedias del pipeline...'
            sh """
            docker rmi ${FRONTEND_BUILD_IMAGE} || true
            docker rmi ${API_TEST_IMAGE}       || true
            docker rmi ${E2E_IMAGE}            || true
            docker rmi ${PERF_IMAGE}           || true
            """
            echo '>>> ✅ Limpieza completada. El contenedor de prod sigue corriendo.'
        }
    }
}