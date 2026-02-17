## Guía de Inicio: Ecosistema de Pruebas (Jenkins + Docker)

Sigan estos pasos para replicar el entorno de **Integración Continua (CI)** en sus máquinas locales.

### 1. Levantar la Infraestructura

Asegúrense de estar en la raíz del proyecto y en la rama `develop`. Ejecuten en su terminal:

```bash
docker compose up -d --build
```

### 2. Desbloqueo Inicial

1. Abran su navegador en `http://localhost:8087`.
2. Para obtener la contraseña maestra, ejecuten en su terminal:
`docker logs jenkins_server`.
3. Peguen la clave y seleccionen **"Install suggested plugins"** (Si hay errores, vean el paso 3).
4. Ingresen sus datos de usuario, contraseña, correo, etc...
5. Suele ser necesario reiniciar el contenedor después de instalar los plugins, una vez que estén instalados y hayan ingresado sus datos, reinicien el contenedor con `docker compose restart`.

### 3. En caso de que hayan errores al instalar plugins

Si hay errores al instalar plugins en el paso de "Install suggested plugins", den click en **"Retry"** hasta que todos los plugins se instalen. Si este paso también falla, ingresen a la configuración de Jenkins -> Plugins -> Available. Ahí pueden buscar los plugin de **Git**, **Pipeline**, **Docker** y **Docker Pipeline**, seleccionarlos e instalar. Si alguno falla de nuevo, vuelvan a Available e intenten instalarlos de nuevo hasta que todos se instalen.

### 4. Crear la Tarea de Automatización (Pipeline)

Sigan esta ruta exacta para que puedan usar el Jenkinsfile, primero vayan al home:

1. **Nueva Tarea (New Item):** Nombre `project-ci`, tipo **Pipeline** .
2. **General:** Marquen *GitHub project* y peguen la URL de nuestro repositorio: `https://github.com/MiguelCiav/ati-dental`.
3. **Triggers:** Marquen *Consultar repositorio (SCM)* y pongan `* * * * *` (revisará cambios cada minuto).
4. **Pipeline Definition:** Seleccionen *Pipeline script from SCM*.
    * **SCM:** Git.
    * **Repository URL:** La URL de nuestro repo (https://github.com/MiguelCiav/ati-dental/).
    * **Credentials:** None
    * **Branch Specifier:** `*/develop`.
    * **Script Path:** `Jenkinsfile`.
5. Den click en **"Save"**.
---

### Comandos de Verificación

Si todo está bien configurado, al hacer clic en **"Construir ahora"** (Build Now), verán cómo se ejecutan automáticamente los 7 stages de nuestra maqueta:

* **Checkout:** Descarga el código.
* **Docker Check:** Valida que Jenkins pueda hablar con Docker.
* **Build/Tests:** Stages definidos en nuestro cerebro del pipeline.
* **Cleanup:** Al finalizar, el sistema ejecutará `docker system prune -f` para que sus discos duros no sufran.