# Docker

<details><summary>Click to expand folder structure</summary>

```bash
my-web-app/
├── docker-compose.dev.yml         # compose file
├── docker-compose.yml
├── .env
├── frontend/
│   ├── Dockerfile.dev
│   ├── Dockerfile
│   ├── .gitignore
│   ├── .dockerignore
│   ├── package.json
│   └── src/
│       └── index.html
└── backend/
    ├── Dockerfile.dev             # Development Dockerfile
    ├── Dockerfile
    ├── requirements.txt
    ├── .gitignore
    ├── .dockerignore
    └── app.py
```

<details><summary>Click to expand for .gitignore</summary>

```bash
# compiled output
/dist
/node_modules
/build

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# temp directory
.temp
.tmp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
```

</details>
<details><summary>Click to expand for .dockerignore</summary>

```bash
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
lib-cov
coverage/
*.lcov
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env*
!.env.example
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next/
out/

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Vue.js build output
dist/

# Vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# Webpack
.webpack/

# Storybook build outputs
.out
.storybook-out
storybook-static

# NestJS specific
dist/
build/

# Angular specific
/dist
/tmp
/out-tsc
/bazel-out

# React specific
build/

# Testing
coverage/
.nyc_output
jest_*

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE and editors
.vscode/
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary folders
tmp/
temp/

# Git
.git/
.gitignore
.gitattributes

# Docker files
Dockerfile*
docker-compose*.yml
.dockerignore

# CI/CD
.github/
.gitlab-ci.yml
.travis.yml
.circleci/
Jenkinsfile
.azure/

# Documentation and configs
README.md
LICENSE*
CHANGELOG.md
.editorconfig
.prettierrc*
.eslintrc*
tsconfig*.json
jest.config.*
webpack.config.*
rollup.config.*
vite.config.*
.babelrc*
tailwind.config.*
postcss.config.*
Makefile
```

</details>
</details>

<details><summary>Development vs Production (Docker Strategy)</summary>

- alpine → tiny, but more fragile for Python. Stable for Node.
- slim → slightly bigger, but much more stable for Python.
- The port your app binds to in code/command is what matters, EXPOSE is just documentation, and -p host:container maps it outside.
- Always keep EXPOSE in sync with the port your app listens on.

| Aspect                 | Development Phase                        | Production Phase                                              |
| ---------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| **Dockerfile Type**    | Single-stage                             | Multi-stage                                                   |
| **Base Image**         | Minimal (e.g., `node:18-alpine`)         | Minimal (e.g., `node:18-alpine`)                              |
| **Dependencies**       | Install **all deps** (including devDeps) | Install **only production deps** (`npm ci --only=production`) |
| **Build Output**       | --                                       | Copy `dist/` build output                                     |
| **Cache & Temp Files** | -- (speed > size)                        | Cleared (`npm cache clean --force`, remove `/tmp`)            |
| **Layer Optimization** | Combine `RUN` commands                   | Combine `RUN` commands                                        |
| **Environment Files**  | `.env.dev`                               | `.env.prod`, `.env.staging`                                   |
| **Volumes**            | Use volumes for hot reload               | --                                                            |
| **User**               | Root (default)                           | Non-root user required                                        |
| **Healthcheck**        | --                                       | Required for container                                        |
| **OCI Labels**         | --                                       | Required (metadata: maintainer, version, etc.)                |
| **Image Scanning**     | --                                       | Required (security compliance)                                |
| **Debugging**          | Use `RUN echo ...` for inspection        | --                                                            |

</details>

<details><summary>Click to expand Dockerfile.dev (Development)</summary>

- Example for `Node.js`

```dockerfile
FROM node:20.17.0-alpine

RUN apk add --no-cache docker-cli bash git curl

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

# Don't use this when you are using docker-compose.yml to run container
CMD ["npm", "run", "start:dev"]
```

- Example for `Python`

```dockerfile
FROM python:3.8-slim-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    cmake \
    git \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
```

</details>

<details><summary>Click to expand Dockerfile (Production)</summary>

- Example for `Node.js`

```dockerfile
# ---------- Base Dependencies ----------
FROM node:20.17.0-alpine AS base
WORKDIR /app
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production \
  && npm cache clean --force \
  && rm -rf /tmp/* /var/cache/apk/*

# ---------- Build Stage ----------
FROM node:20.17.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Runtime Stage ----------
FROM node:20.17.0-alpine AS runner
WORKDIR /app

RUN apk add --no-cache docker-cli curl bash

# Copy production node_modules from base
COPY --from=base /app/node_modules ./node_modules

# Copy built code from builder
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup --gid 1001 appgroup && \
    adduser --uid 1001 --ingroup appgroup appuser

USER appuser

# Environment variables
ENV NODE_ENV=production

EXPOSE 3000

# Labels
LABEL org.opencontainers.image.authors="React and Python Team" \
      org.opencontainers.image.stage="production" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.description="Smart Recruitment with Integrated Proctoring System" \
      org.opencontainers.image.url="https://github.com/SharathM5932/Smart-Recruitment-with-Integrated-Proctoring-System.git" \


CMD ["node", "dist/main.js"]
```

</details>

<details><summary>Docker Commands</summary>

- Push dockerfile, docker-compose.yml, codebase, db backup (optional) to git

#### Common Docker Command Patterns

```bash
docker run -d \
  --name <container_name> \
  --network <network_name> \
  -p <host_port>:<container_port> \
  --env-file <env_path> \
  -v <volume_name>:<path/in/container> \
  <image_name>:<tag>
```

<details><summary>Docker Auth</summary>

| Description | Command                      |
| ----------- | ---------------------------- |
| Login       | `docker login -u <username>` |
| Logout      | `docker logout`              |

</details>

<details><summary>Docker Images</summary>

| Description                   | Command                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------- |
| Build an image                | `docker build -f <Dockerfile_name> -t <image_name>:tag <path_to_dockerfile>` |
| List all local images         | `docker images`                                                              |
| Inspect details of an image   | `docker inspect image <image_name:tag>`                                      |
| Tag/ rename the image         | `docker tag <source_image:tag> <new_image:tag>`                              |
| Remove a local image          | `docker rmi <image_name:tag>`                                                |
| Remove image by ID            | `docker rm <image_name/image_id>`                                            |
| Save an image                 | `docker save <image_name>:tag \| gzip > <image_name>.tar.gz`                 |
| Load an image                 | `gunzip -c <image_name>.tar.gz \| docker load`                               |
| Push an image to Docker Hub   | `docker push <image_name:tag>`                                               |
| Pull an image from Docker Hub | `docker pull <image_name:tag>`                                               |

</details>

<details><summary>Docker Container</summary>

| Description                                  | Command                                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Run a container with port mapping            | `docker run -d --name <container_name> -p <host_port>:<container_port> <image_name:tag>` |
| List all running containers                  | `docker ps`                                                                              |
| List all containers (including stopped ones) | `docker ps -a`                                                                           |
| Inspect details of a container               | `docker inspect <container_name_or_id>`                                                  |
| Stop a running container                     | `docker stop <container_name_or_id>`                                                     |
| Start a stopped container                    | `docker start <container_name_or_id>`                                                    |
| Pause a running container                    | `docker pause <container_name_or_id>`                                                    |
| Unpause a paused container                   | `docker unpause <container_name_or_id>`                                                  |
| Remove a stopped container                   | `docker rm <container_name_or_id>`                                                       |
| Remove a running container (forcefully)      | `docker rm -f <container_name_or_id>`                                                    |
| View container logs                          | `docker logs <container_name_or_id>`                                                     |

</details>

<details><summary>Docker Volumes (Blind mount/ Hot reload and Named volumes/ Data persistence)</summary>

- Volumes are independent of containers.
- Blind mount mainly used for application server.
- Named volumes mainly used for db server.

| Description                                                  | Command                                                                                                                       |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Run a container with a volume (Blind Mount) and port mapping | `docker run -d --name <container_name> -p <host_port>:<container_port> -v <volume_name>:<path/in/container> <image_name:tag>` |
| Create a named volume                                        | `docker volume create <volume_name>`                                                                                          |
| Attach Named Volume to a Container                           | `docker run -d --name <container_name> -v <volume_name>:<path/in/container> <image_name:tag>`                                 |
| List all volumes                                             | `docker volume ls`                                                                                                            |
| Inspect details of a volume                                  | `docker volume inspect <volume_name>`                                                                                         |
| Remove a volume                                              | `docker volume rm <volume_name>`                                                                                              |

</details>

<details><summary>Docker Network</summary>

- Containers talk to each other.
- By default network bridge (called literally bridge).
- Two ways to put a container into a network,
  - At container creation
  - After container is created (manual attach) after that remove fr. default networks.
- Container Communication
  - Public user (browser/Postman) hits `http://localhost:8080`
  - For Container to Container communication
    - if you’re not using Compose, the endpoint is: `http://<container_name>:<container_port>`
    - if you're using Compose, the endpoint is: `http://<service_name>:<container_port>`

| Description                           | Command                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| Create a user-defined bridge network  | `docker network create <network_name>`                                             |
| List all networks                     | `docker network ls`                                                                |
| Inspect details of a network          | `docker network inspect <network_name>`                                            |
| Inspect details of a network          | `docker inspect <network_name> --format='{{json .NetworkSettings.Networks}} \| jq` |
| Disconnect a container from a network | `docker network disconnect <network_name> <container_name>`                        |
| Connect a container to a network      | `docker network connect <network_name> <container_name>`                           |
| Remove a network                      | `docker network rm <network_name>`                                                 |

</details>

<details><summary>Docker Compose (dev: docker-compose.dev.yml) (Prod: docker-compose.yml)</summary>

- You should always run docker compose up from the same folder where your docker-compose.yml is located.
- If you use `docker-compose.dev.yml` as a file name, then run
  - `$env:COMPOSE_FILE="docker-compose.dev.yml"` - powershell
  - `export COMPOSE_FILE=docker-compose.dev.yml` - bash

<details><summary>Structure of docker-compose.yml file</summary>

```Dockerfile
version: "3.9"                                        # Docker Compose file format version

services:                                             # Define containers (services) here
    <service_name>:
        image: <image_name:tag>                       # build an image (main_app:v1)
        build:
            context: <path>                           # Path to Dockerfile directory (./user)
            dockerfile: Dockerfile                    # (optional) specify Dockerfile
        container_name: <name>                        # Custom container name (main_app)
        ports:
            - "<host_port>:<container_port>"          # Port mapping
        environment:                                  # Env variables (inline) (SECRET_KEY: jwtsecretkey)
            KEY: value
        env_file:                                     # mention .env file path (./user/.env )
            - <path>
        volumes:                                      # Mount volumes
            - <host_path>:<container_path>            # Bind mount (host_path -> where the dockerfile present, container_path -> /app)
            - ./main-app:/app                         # Example for blind mount

            - <volume_name>:<container_path>          # Named volume (container_path -> /app/<see-example>)
            - main_app_node_modules:/app/node_modules # Example for named volume
        networks:                                     # Networks to connect to
            - <network_name>
        depends_on:                                   # Service dependencies
            - <service_name>                          # Start db before app
        restart: unless-stopped                       # Restart policy (Options: no, on-failure, unless-stopped, always)
        command: <custom_command>                     # Override default CMD (['npm','run','start:dev'])

volumes:                                              # Declare named volumes
    <volume_name>:

networks:                                             # Declare networks
    <network_name>:
        driver: bridge                                # Type of network
```

</details>

| Description                                                                                          | Command                                     |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Just build (If you change Dockerfile or dependencies and if changes code no need blind mount volume) | `docker compose build`                      |
| Rebuild all services                                                                                 | `docker compose build --no-cache`           |
| Rebuild specific service                                                                             | `docker compose build --no-cache <service>` |
| Run with no logs                                                                                     | `docker compose up -d`                      |
| Stop containers and remove them along with default networks                                          | `docker compose down`                       |
| Show specific service logs                                                                           | `docker compose logs -f <service>`          |
| Show all service logs                                                                                | `docker compose logs -f`                    |
| Stop containers **without removing them** (you can restart later)                                    | `docker compose stop`                       |
| Start previously stopped containers                                                                  | `docker compose start`                      |
| Show status of containers (running, stopped, ports, names)                                           | `docker compose ps`                         |

</details>
