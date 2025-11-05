pipeline {
    agent {
        label {
            label 'slave-01'
            retries 2
        }
    }
    environment {
        GITHUB = "https://github.com/titas2003/rocket-explosive.git"
        PORT = "3100"
        JWT_SECRET = "your_jwt_secret_key_here"
        MONGO_URI = "mongodb+srv://admin:admin@rocket-db.tdqlc.mongodb.net/rocket-dev?retryWrites=true&w=majority&appName=rocket-db"
        NODE_ENV = "UAT"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "pulling from git.."
                git branch: "master", url: "${GITHUB}", credentialsId: 'Git'
            }
        }

        stage('Node Setup') {
            steps {
                sh '''
                sudo apt install nodejs -y
                node -v
                '''
            }
        }

        stage('Environment Creation') {
            steps {
                sh '''
                cat > .env << EOF
                MONGO_URI=mongodb+srv://admin:admin@rocket-db.tdqlc.mongodb.net/rocket-dev?retryWrites=true&w=majority&appName=rocket-db
                JWT_SECRET=your_jwt_secret_key_here
                PORT=5000
                EOF
                '''
            }
        }
        stage('Create UAT Image') {
            steps {
                sh '''
                docker build -t rocket-exp:v2.0.0 .
                '''
            }
        }
    }

}