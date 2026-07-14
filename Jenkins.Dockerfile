FROM jenkins/jenkins:lts
USER root


RUN apt-get update && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs


RUN apt-get install -y docker.io docker-compose


RUN groupadd -f docker && usermod -aG docker jenkins

USER jenkins
RUN jenkins-plugin-cli --plugins credentials-binding gradle workflow-aggregator

USER root
