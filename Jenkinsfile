pipeline {

    agent any

    environment {

        AWS_REGION = "us-east-1"
        AWS_ACCOUNT_ID = "888635225328"

        FRONTEND_REPO = "codeinsight-frontend"
        USER_REPO = "codeinsight-user-service"
        CODING_REPO = "codeinsight-coding-service"
        AI_REPO = "codeinsight-ai-service"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/varunesh-v/CodeInsight-AI.git'
            }
        }

        stage('Login to ECR') {
            steps {
                // The 'withAWS' block must wrap the commands that need AWS access
                withAWS(credentials: 'aws-ecr-creds', region: env.AWS_REGION) {
                    sh '''
                        aws ecr get-login-password --region $AWS_REGION \
                        | docker login \
                        --username AWS \
                        --password-stdin \
                        $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                    docker build -t $FRONTEND_REPO ./frontend
                    docker tag $FRONTEND_REPO:latest \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest
                '''
            }
        }

        stage('Build User Service') {
            steps {
                sh '''
                    docker build -t $USER_REPO ./backend/user-service
                    docker tag $USER_REPO:latest \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$USER_REPO:latest
                '''
            }
        }

        stage('Build Coding Service') {
            steps {
                sh '''
                    docker build -t $CODING_REPO ./backend/coding-service
                    docker tag $CODING_REPO:latest \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$CODING_REPO:latest
                '''
            }
        }

        stage('Build AI Service') {
            steps {
                sh '''
                    docker build -t $AI_REPO ./backend/ai-service
                    docker tag $AI_REPO:latest \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$AI_REPO:latest
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$USER_REPO:latest
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$CODING_REPO:latest
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$AI_REPO:latest
                '''
            }
        }
    }
}