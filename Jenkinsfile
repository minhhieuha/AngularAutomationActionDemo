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
                echo 'Installing dependencies (Robust Mode)...'
                // Using "call" is critical for batch files on Windows Jenkins
                bat "call npm install --no-audit"
                echo 'Installing Playwright browsers...'
                bat "call .\\node_modules\\.bin\\playwright install --with-deps chromium"
            }
        }

        stage('Unit Test') {
            steps {
                echo 'Running Unit Tests (Vitest)...'
                // Direct path to ng binary to avoid "not found" errors
                bat "call .\\node_modules\\.bin\\ng test --watch=false"
            }
        }

        stage('Automation Test') {
            steps {
                echo 'Running Automation Tests (Playwright)...'
                bat "call .\\node_modules\\.bin\\playwright test"
            }
        }

        stage('Build') {
            steps {
                echo 'Building Angular application for production...'
                bat "call .\\node_modules\\.bin\\ng build"
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
