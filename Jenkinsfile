pipeline {
    agent any 
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
        stage('API Tests') { steps { echo 'Maqueta: Newman' } }
        stage('E2E Tests') { steps { echo 'Maqueta: Cypress' } }
        stage('Performance') { steps { echo 'Maqueta: JMeter' } }
    }
    post {
        always {
            sh 'docker system prune -f'
            echo 'Limpieza completada'
        }
    }
}