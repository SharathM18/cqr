# Docker

<details><summary>Click to expand folder structure</summary>

```bash
my-web-app/
├── docker-compose.yml         # compose file (custom_name-compose.yml)
├── .env
├── frontend/
│   ├── Dockerfile
│   ├── .gitignore
│   ├── .dockerignore
│   ├── package.json
│   └── src/
│       └── index.html
└── backend/
    ├── Dockerfile             # Development Dockerfile (custom_name.Dockerfile)
    ├── requirements.txt
    ├── .gitignore
    ├── .dockerignore
    └── app.py
```

#### Files: .gitignore and .dockerignore

```bash
# Node modules
node_modules
dist
npm-debug.log
yarn-error.log

# Environment files
.env
.env.*.local

# Git
.git
.gitignore

# OS files
.DS_Store
Thumbs.db

# IDE/editor files
.vscode
.idea
```

</details>

<details><summary>Development vs Production (Docker Strategy)</summary>

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
| **OCI Labels**         | Optional                                 | Required (metadata: maintainer, version, etc.)                |
| **Image Scanning**     | --                                       | Required (security compliance)                                |
| **Debugging**          | Use `RUN echo ...` for inspection        | --                                                            |

</details>

<details><summary>Click to expand Dockerfile (Development)</summary>

```dockerfile
ARG NODE_VERSION=18.17.0
FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

EXPOSE 3000

# CMD ["npm", "run", "start:dev"]
CMD sh -c 'echo "Running in $NODE_ENV mode with Node.js $NODE_VERSION" && npm run start:dev'
```

</details>

<details><summary>Click to expand Dockerfile (Production)</summary>

```dockerfile
# ---------- Build Stage ----------
ARG NODE_VERSION=18.17.0
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Copy package files and install ALL deps (including dev for build tools)
COPY package*.json ./
RUN npm ci

# Copy rest of the source
COPY . .

# Build the NestJS project (outputs to /app/dist)
RUN npm run build


# ---------- Runtime Stage ----------
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY package*.json ./

# Install only production deps, remove npm cache and clean leftover temp files from Alpine
RUN RUN npm ci --only=production \
  && npm cache clean --force \
  && rm -rf /tmp/* /var/cache/apk/*


# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create a group called "appgroup" and a user called "appuser"
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Switch to the non-root user
USER appuser


# Set environment variables (override with --env-file at runtime)
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

EXPOSE 3000

# Healthcheck to ensure container is alive
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1


# OCI labels for metadata
LABEL org.opencontainers.image.authors="DevOps Team <ops@example.com>"
LABEL org.opencontainers.image.stage="production"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.description="NestJS Production Image"
LABEL org.opencontainers.image.url="https://github.com/sharath18"
LABEL org.opencontainers.image.created="2025-08-19"

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

| Description                           | Command                                                                           |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| Create a user-defined bridge network  | `docker network create <network_name>`                                            |
| List all networks                     | `docker network ls`                                                               |
| Inspect details of a network          | `docker network inspect <network_name>`                                           |
| Inspect details of a network          | `docker inspect <network_name> --format='{{json .NetworkSettings.Networks}} \|jq` |
| Disconnect a container from a network | `docker network disconnect <network_name> <container_name>`                       |
| Connect a container to a network      | `docker network connect <network_name> <container_name>`                          |
| Remove a network                      | `docker network rm <network_name>`                                                |

</details>

<details><summary>Docker Compose</summary>

<details><summary>Structure of docker-compose.yml file</summary>

```Dockerfile
version: "3.9"                                        # Docker Compose file format version

services:                                             # Define containers (services) here
    <service_name>:
        image: <image_name:tag>                       # build an image
        build:
            context: <path>                           # Path to Dockerfile directory (./user)
            dockerfile: Dockerfile                    # (optional) specify Dockerfile
        container_name: <name>                        # Custom container name
        ports:
            - "<host_port>:<container_port>"          # Port mapping
        environment:                                  # Env variables (inline) (SECRET_KEY: jwtsecretkey)
            KEY: value
        env_file:                                     # mention .env file path (./user/.env )
            - <path>
        volumes:                                      # Mount volumes
            - <host_path>:<container_path>            # Bind mount (host_path -> where the dockerfile present, container_path -> idk)
            - <volume_name>:<container_path>          # Named volume (container_path -> idk)
        networks:                                     # Networks to connect to
            - <network_name>
        depends_on:                                   # Service dependencies
            - <service_name>                          # Start db before app
        restart: unless-stopped                       # Restart policy (Options: no, on-failure, unless-stopped, always)
        command: <custom_command>                     # Override default CMD (['npm','run','start:Dev'])

volumes:                                              # Declare named volumes
    <volume_name>:

networks:                                             # Declare networks
    <network_name>:
        driver: bridge                                # Type of network
```

</details>

| Description                                               | Command                                                              |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| Create and start containers defined in docker-compose.yml | `docker compose up`                                                  |
| Stop and remove containers defined in docker-compose.yml  | `docker compose down`                                                |
| Build or rebuild services                                 | `docker compose build`                                               |
| List containers for a specific Docker Compose project     | `docker compose ps`                                                  |
| View logs for services                                    | `docker compose logs`                                                |
| Scale services to a specific number of containers         | `docker compose up -d --scale <service_name>=<number_of_containers>` |
| Run a one-time command in a service                       | `docker compose run <service_name> <command>`                        |
| Pause a service                                           | `docker compose pause <service_name>`                                |
| Unpause a service                                         | `docker compose unpause <service_name>`                              |
| View details of a service                                 | `docker compose ps <service_name>`                                   |

</details>
