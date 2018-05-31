pipeline {
    agent any
    tools {
        node {
             env.NODEJS_HOME = "${tool 'node'}"
             // on linux / mac
             env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
             sh 'npm --version'
         }
    }
    stages {
        stage ('Initialize') {
            steps {
                sh 'echo hoi'
            }
        }
    }
}