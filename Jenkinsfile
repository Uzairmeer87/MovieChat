pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    def run = { cmd -> isUnix() ? sh(cmd) : bat(cmd) }
                    dir('backend') {
                        echo 'Installing backend dependencies...'
                        run('npm install')
                    }
                    dir('frontend') {
                        echo 'Installing frontend dependencies...'
                        run('npm install')
                    }
                }
            }
        }

        stage('Frontend Lint') {
            steps {
                script {
                    def run = { cmd -> isUnix() ? sh(cmd) : bat(cmd) }
                    dir('frontend') {
                        echo 'Running frontend linter...'
                        run('npm run lint')
                    }
                }
            }
        }

        stage('Frontend Build') {
            steps {
                script {
                    def run = { cmd -> isUnix() ? sh(cmd) : bat(cmd) }
                    dir('frontend') {
                        echo 'Building frontend...'
                        run('npm run build')
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    echo 'Building docker containers...'
                    if (isUnix()) {
                        sh 'whoami'
                        sh 'id'
                        sh 'ls -l /var/run/docker.sock || true'
                        sh 'docker compose build || docker-compose build'
                    } else {
                        bat 'whoami'
                        bat 'docker compose build || docker-compose build'
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
