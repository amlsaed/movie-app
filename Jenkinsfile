pipeline {
    agent any
    
    environment {
        NODE_VERSION = '20.x'
        DOCKER_IMAGE = 'react-movie-app'
        REGISTRY = 'your-registry.com'
    }
    
    tools {
        nodejs "${NODE_VERSION}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code checked out successfully'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'node --version'
                    sh 'npm --version'
                    sh 'npm ci'
                }
            }
        }
        
        stage('Code Quality & Security') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint || true'
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'reports',
                            reportFiles: 'eslint-report.html',
                            reportName: 'ESLint Report'
                        ])
                    }
                }
                
                stage('Security Audit') {
                    steps {
                        sh 'npm audit --audit-level high || true'
                        sh 'npm audit fix --dry-run || true'
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    sh 'npm test -- --coverage --watchAll=false || true'
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }
        
        stage('Docker Build') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    echo 'Deploying to staging environment'
                    // Add your staging deployment commands here
                    sh '''
                        echo "Deploying to staging server"
                        # scp -r dist/ user@staging-server:/var/www/html/
                        # ssh user@staging-server "sudo systemctl restart nginx"
                    '''
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                script {
                    echo 'Deploying to production environment'
                    // Integration with Vercel or other deployment services
                    sh '''
                        echo "Deploying to production"
                        # Add production deployment commands
                        # This could trigger Vercel deployment or other services
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
            // Send success notifications
            slackSend(
                channel: '#deployments',
                color: 'good',
                message: "✅ Build ${BUILD_NUMBER} succeeded for ${JOB_NAME}"
            )
        }
        failure {
            echo 'Pipeline failed!'
            // Send failure notifications
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: "❌ Build ${BUILD_NUMBER} failed for ${JOB_NAME}"
            )
        }
    }
}