# Usamos la versión estable recomendada por el laboratorio
FROM jenkins/jenkins:lts 
USER root 
RUN apt-get update && apt-get install -y docker.io
RUN apt-get install -y docker-compose