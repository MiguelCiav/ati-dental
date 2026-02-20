pipeline {
    agent any 

    environment {
        API_TEST_IMAGE = "ati-dental_ati-network"
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
        stage('Build Frontendd') {
            steps {
                sh '''#!/bin/sh
                set -eux

                docker build \
                    -f frontend/Dockerfile.build \
                    -t frontend-app:build \
                    frontend
                '''
            }
        }
        stage('Frontend Production Image') {
            steps {
                sh '''#!/bin/sh
                set -eux

                docker build \
                    -f frontend/Dockerfile.prod \
                    -t frontend-app:prod \
                    frontend
                '''
            }
        }
        stage('Unit Tests') {
            steps {
                echo '>>> [Unit Tests] Ejecutando pruebas unitarias con Jest...'
                sh '''#!/bin/sh
                set -eux
                docker run --rm frontend-app:build npm test
                '''
                echo '>>> [Unit Tests] \u2705 Todas las pruebas unitarias pasaron.'
            }
        }
        stage('API Tests') { 
            steps { 
                script {
                    // catchError permite que el pipeline siga en amarillo (Unstable) si fallan los tests
                    catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                        // 1. Construir la imagen de Newman
                        sh "docker build -t ${API_TEST_IMAGE} -f tests/api/Dockerfile.test tests/api"
                        
                        // 2. Ejecutar Newman
                        sh "docker run --rm --network ati-dental_ati-network ${API_TEST_IMAGE} run collection.json"

                        echo 'API Tests ejecutados. Si hay fallos, el pipeline se marcará como UNSTABLE pero continuará con las siguientes etapas.'
                    }
                }
            } 
        }
        stage('E2E Tests') { steps { echo 'Maqueta: Cypress' } }
        stage('Performance') { 
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {

                        // 1. Construir la imagen de JMeter
                        sh "docker build -t ${PERF_TEST_IMAGE} -f tests/performance/Dockerfile.perf tests/performance"
                        // 2. Ejecutar JMeter
                        sh "docker run --rm ${PERF_TEST_IMAGE} -n -t plan_de_pruebas.jmx -l resultados.jtl"

                        echo 'Pruebas de rendimiento ejecutadas. Si hay fallos, el pipeline se marcará como UNSTABLE pero continuará con las siguientes etapas.'
                    }
                }

            }
        }
    }
    post {
        always {
            sh 'docker system prune -f'
            echo 'Limpieza completada'
        }
    }
}