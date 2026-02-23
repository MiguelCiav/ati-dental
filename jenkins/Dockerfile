# Usamos la versión estable recomendada por el laboratorio
FROM jenkins/jenkins:2.504-lts
USER root

# --- Paso 1: Dependencias base ---
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# --- Paso 2: Agregar el repositorio oficial de Docker ---
# El repo base de Debian (docker.io) no garantiza que el binario quede
# en el PATH que Jenkins usa al ejecutar sus scripts de pipeline.
# El paquete docker-ce-cli del repo oficial de Docker sí lo garantiza.
RUN install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg \
    -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
    https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null

# --- Paso 3: Instalar Docker CLI + plugin Compose v2 ---
# docker-ce-cli        → binario 'docker' en /usr/bin/docker
# docker-compose-plugin → habilita 'docker compose' (v2) como subcomando
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    docker-ce-cli \
    docker-compose-plugin && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*