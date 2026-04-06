pipeline {
    agent any

    environment {
        // ID of the credential in Jenkins containing your Render Deploy Hook URL
        RENDER_DEPLOY_HOOK = credentials('RENDER_DEPLOY_HOOK')
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                bat 'npm install'
                echo 'Installing Playwright browsers...'
                bat 'npx playwright install --with-deps chromium'
            }
        }

        stage('Unit Test') {
            steps {
                echo 'Running Unit Tests (Vitest)...'
                bat 'npm test -- --watch=false'
            }
        }

        stage('Automation Test') {
            steps {
                echo 'Running Automation Tests (Playwright)...'
                bat 'npx playwright test'
            }
        }

        stage('Build') {
            steps {
                echo 'Building Angular application for production...'
                bat 'npm run build'
            }
        }

        stage('Deploy to Render') {
            steps {
                echo 'Triggering Render Deployment Hook...'
                // Using curl to trigger the deployment webhook from Render
                bat "curl -X POST ${env.RENDER_DEPLOY_HOOK}"
            }
        }
    }

    post {
        always {
            echo 'Archiving test results...'
            // Optional: archive Playwright reports and Vitest results
            archiveArtifacts artifacts: 'playwright-report/**, dist/**', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline completed successfully and Deployment triggered!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
