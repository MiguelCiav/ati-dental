# Guía de Pruebas de Calidad (QA) - ATI Dental

Este documento está orientado al equipo de QA y desarrolladores para proporcionar instrucciones claras sobre cómo ejecutar las pruebas automatizadas (API, Rendimiento y E2E) de manera manual e individual en sus entornos locales, sin depender de la ejecución del pipeline de Jenkins.

---

## 🚀 Ejecución de Pruebas con Docker (Aisladas)

El proyecto cuenta con contenedores Docker específicos para cada tipo de prueba en el directorio `tests/`. Puedes ejecutarlos por separado según lo que requieras validar. 

### 🟢 1. Pruebas de API (Newman/Postman)
Se ubican en `tests/api/`. Evalúan los endpoints y respuestas del Backend. Hemos subdividido la gran colección anterior en archivos más pequeños por funcionalidad que se encuentran en `tests/api/collections/`.

**Construir la imagen:**
```bash
docker build -t qatest-api -f tests/api/Dockerfile.test tests/api
```
**Ejecutar TODAS las pruebas secuencialmente:**
```bash
docker run --rm --network host qatest-api
```
**Ejecutar pruebas individuales (pasando la ruta como comando):**
```bash
# Probar solo el inicio de sesión
docker run --rm --network host qatest-api collections/auth.json

# Probar solo la gestión de pacientes
docker run --rm --network host qatest-api collections/patients.json

# Probar solo la configuración de usuarios
docker run --rm --network host qatest-api collections/users.json
```

### 🟡 2. Pruebas E2E (Cypress)
Se ubican en `tests/e2e/`. Simulan la navegación y los clics de los usuarios en el Frontend en un navegador real.

**Construir la imagen:**
```bash
docker build -t qatest-e2e -f tests/e2e/Dockerfile.e2e tests/e2e
```
**Ejecutar contenedor temporal en modo sin interfaz (Headless):**
```bash
docker run --rm --network host qatest-e2e
```

**Alternativa Manual Local (Para interactuar visualmente UI):**
Si tienes Node instalado y quieres ver las pruebas visualmente:
```bash
cd tests/e2e
npm install
npx cypress open
```

### 🔴 3. Pruebas de Rendimiento o Performance (JMeter)
Se ubican en `tests/performance/`. Miden el tiempo de respuesta bajo carga. El script original se ha dividido en tres escenarios modulares en la carpeta `tests/performance/plans/`:

**Construir la imagen:**
```bash
docker build -t qatest-perf -f tests/performance/Dockerfile.perf tests/performance
```

**Paso Previo: Crear la carpeta de resultados en tu máquina:**
```bash
mkdir -p tests/performance/reportes_qa
```

**Ejecutar TODOS los scripts de carga secuencialmente:**
```bash
docker run --rm --network host -v $(pwd)/tests/performance/reportes_qa:/app/results qatest-perf
```

**Ejecutar pruebas de carga individualmente:**
```bash
# Prueba 1: Estrés exclusivo al Login
docker run --rm --network host -v $(pwd)/tests/performance/reportes_qa:/app/results qatest-perf login_load.jmx

# Prueba 2: Impacto de crear pacientes concurrentemente
docker run --rm --network host -v $(pwd)/tests/performance/reportes_qa:/app/results qatest-perf patient_flow_load.jmx

# Prueba 3: Estrés modificando preferencias de idioma
docker run --rm --network host -v $(pwd)/tests/performance/reportes_qa:/app/results qatest-perf update_config_load.jmx
```
*(Los reportes analíticos para las pruebas que corras aparecerán como un sitio web en la carpeta local `tests/performance/reportes_qa`)*.
