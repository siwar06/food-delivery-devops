pipeline {

    agent {
        label 'ubuntu'
    }

    options {
        timestamps()
    }

    stages {

        stage('1. Checkout') {
            steps {
                echo 'Getting source code from GitHub'
                checkout scm
            }
        }

        stage('2. Verify Environment') {
            steps {
                sh '''
                    echo "===== JAVA ====="
                    java -version

                    echo "===== DOCKER ====="
                    docker --version

                    echo "===== MAVEN ====="
                    ./mvnw -version
                '''
            }
        }

        stage('3. Build and Test') {
            steps {
                echo 'Building all Maven modules and running tests'
                sh '''
                    chmod +x mvnw
                    ./mvnw -B clean verify
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Food Delivery CI Pipeline completed!'
        }

        failure {
            echo 'FAILURE: Check the Console Output for details.'
        }

        always {
            echo 'CI Pipeline finished.'
        }
    }
}
