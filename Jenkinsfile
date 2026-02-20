pipeline {
    agent any 

    environment {
        API_TEST_IMAGE = "ati-dental-api-test"
        PERF_TEST_IMAGE = "ati-dental-perf-test"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm 
            }
        }
        stage('Docker Check') {
            steps {
                sh 'docker version' 
            }
        }
        stage('Build Frontend') { steps { echo 'Maqueta: Build' } }

        stage('Unit Tests') { steps { echo 'Maqueta: npm test' } }

        stage('API Tests') { 
            steps { 
                script {
                    // catchError permite que el pipeline siga en amarillo (Unstable) si fallan los tests
                    catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                        // 1. Construir la imagen de Newman
                        sh "docker build -t ${API_TEST_IMAGE} -f tests/api/Dockerfile.test tests/api"
                        
                        // 2. Ejecutar Newman
                        sh "docker run --rm ${API_TEST_IMAGE} run collection.json"

                        echo 'API Tests ejecutados. Si hay fallos, el pipeline se marcará como UNSTABLE pero continuará con las siguientes etapas.'
                    }
                }
            } 
        }
        stage('E2E Tests') { steps { echo 'Maqueta: Cypress' } }
        stage('Performance') { 
            
        }
    }
    post {
        always {
            sh 'docker system prune -f'
            echo 'Limpieza completada'
        }
    }
}