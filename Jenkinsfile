pipeline {
    agent any

    // Ensure you have NodeJS plugin configured in Jenkins with the name 'node'
    // If you already have node installed on the agent, you can remove the tools section.
    tools {
        nodejs 'node'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    dir('backend') {
                        echo 'Installing backend dependencies...'
                        if (isUnix()) {
                            sh 'npm install'
                        } else {
                            bat 'npm install'
                        }
                    }
                    dir('frontend') {
                        echo 'Installing frontend dependencies...'
                        if (isUnix()) {
                            sh 'npm install'
                        } else {
                            bat 'npm install'
                        }
                    }
                }
            }
        }

        stage('Frontend Lint') {
            steps {
                script {
                    dir('frontend') {
                        echo 'Running frontend linter...'
                        if (isUnix()) {
                            sh 'npm run lint'
                        } else {
                            bat 'npm run lint'
                        }
                    }
                }
            }
        }

        stage('Frontend Build') {
            steps {
                script {
                    dir('frontend') {
                        echo 'Building frontend...'
                        if (isUnix()) {
                            sh 'npm run build'
                        } else {
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    echo 'Building docker containers...'
                    if (isUnix()) {
                        sh 'docker-compose build'
                    } else {
                        bat 'docker-compose build'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
