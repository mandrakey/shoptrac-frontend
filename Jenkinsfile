pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        checkout scm: [$class: 'GitSCM', branches: [[name: '*/master']], userRemoteConfigs: [[credentialsId: 'scm-manager-mandrakey', url: 'https://scm.bleuelmedia.com/scm/repo/shoptrac/frontend']]]
        configFileProvider([configFile(fileId: 'shoptrac-frontend-env-production', targetLocation: '.env.production')]) {
          sh 'npm install && npm update && npm audit fix && NODE_OPTIONS=--openssl-legacy-provider npm run build && tar -cf shoptrac-frontend.tar dist && bzip2 -f shoptrac-frontend.tar'
        }
        archiveArtifacts artifacts: 'shoptrac-frontend.tar.bz2'
      }
    }

    stage('Deploy') {
      steps {
        sshPublisher(publishers: [sshPublisherDesc(configName: 'agate.top-web.info', transfers: [sshTransfer(sourceFiles: 'shoptrac-frontend.tar.bz2', execCommand: 'cd /var/www/shoptrac.dau.fun && tar -cf /tmp/shoptrac-frontend.bak.tar web && cd /tmp && tar -xf shoptrac-frontend.tar.bz2 && cp -r dist/* /var/www/shoptrac.dau.fun/web/ && rm -rf dist shoptrac-frontend.tar.bz2')])])
      }
    }
  }
}