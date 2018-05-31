pipeline {
    agent any
    tools {
        nodejs 'node'
    }
    stages {
        stage ('build-docker-image') {
            when {
                anyOf {
                    branch 'master'
                    branch 'release'
                }
            }
            steps {
                sh 'docker build -t simulation-backend .'
                sh 'docker tag simulation-backend:latest esd6nl/sim-backend'
            }
        }
        stage ('push-docker-image') {
            when {
                anyOf {
                    branch 'master'
                    branch 'release'
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker', passwordVariable: 'dockerPassword', usernameVariable: 'dockerUser')]) {
                                    sh "docker login -u ${env.dockerUser} -p ${env.dockerPassword}"
                                    sh 'docker push esd6nl/sim-backend'
                            }
            }
        }
    }
}