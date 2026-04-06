pipeline {
    agent any

    environment {
        // ID of the credential in Jenkins containing your Render Deploy Hook URL
        RENDER_DEPLOY_HOOK = credentials('RENDER_DEPLOY_HOOK')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Cleaning workspace (Turbo Reset Mode)...'
                // Force a clean state to avoid "762ms up to date" issues
                bat 'if exist node_modules rd /s /q node_modules'
                echo 'Installing dependencies...'
                bat 'call npm install --no-audit'
                echo 'Installing Playwright browsers...'
                // Using absolute quoted path with .cmd extension
                bat "call \"${WORKSPACE}\\node_modules\\.bin\\playwright.cmd\" install --with-deps chromium"
            }
        }

        stage('Unit Test') {
            steps {
                echo 'Running Unit Tests (Vitest)...'
                // Direct absolute path to ng.cmd
                bat "call \"${WORKSPACE}\\node_modules\\.bin\\ng.cmd\" test --watch=false"
            }
        }

        stage('Automation Test') {
            steps {
                echo 'Running Automation Tests (Playwright)...'
                bat "call \"${WORKSPACE}\\node_modules\\.bin\\playwright.cmd\" test"
            }
        }

        stage('Build') {
            steps {
                echo 'Building Angular application for production...'
                bat "call \"${WORKSPACE}\\node_modules\\.bin\\ng.cmd\" build"
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
