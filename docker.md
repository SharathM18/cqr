# Docker

<details><summary>Click to expand folder structure</summary>

```bash
my-nestjs-app/
├─ dist/                      # Compiled output (generated after npm run build)
├─ node_modules/              # Installed dependencies
├─ src/                       # Source code
│ ├─ main.ts                  # App entry point
├─ .env.dev
├─ .env.staging
├─ .env.prod
├─ .gitignore
├─ .dockerignore
├─ docker-compose.yml         # Optional compose file (custom_name-compose.yml)
├─ frontend.Dockerfile        # Development Dockerfile (custom_name.Dockerfile)
├─ package.json               # Project metadata + dev deps + prod deps
├─ package-lock.json
└─ README.md                  # Documentation
```

### For .gitignore and .dockerignore

```bash
node_modules
dist
npm-debug.log
yarn-error.log
.git
.gitignore
.env*
.vscode
.idea
.DS_Store
Thumbs.db
coverage/
*.test.js
*.spec.js
.nyc_output
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

<details>
<summary>Click to expand backend.Dockerfile (Development)</summary>

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

<details> <summary>Click to expand Dockerfile.prod (Production)</summary>

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

<details> <summary>Docker Auth</summary>

| Description | Complete Command             |
| ----------- | ---------------------------- |
| Login       | `docker login -u <username>` |
| Logout      | `docker logout`              |

</details>
<details> <summary>Docker Images</summary>

| Description                    | Complete Command                                                      | Example                                               |
| ------------------------------ | --------------------------------------------------------------------- | ----------------------------------------------------- |
| Build an image                 | `docker build -f Dockerfile -t <image_name>:tag <path_to_dockerfile>` | `docker build -f frontend.Dockerfile. -t myapp:dev .` |
| List all local images          | `docker images`                                                       | `docker images`                                       |
| Inspect details of an image    | `docker inspect image <image_name:tag>`                               | `docker inspect image myapp:v1`                       |
| Tag an image/ rename the image | `docker tag <source_image:tag> <new_image:tag>`                       | `docker tag myapp:latest my-app:v1`                   |
| Remove a local image           | `docker rmi <image_name:tag>`                                         | `docker rmi myapp:latest`                             |
| Remove image by ID             | `docker rm <image_name/image_id>`                                     | `docker rm fd484f19954f`                              |
| Remove unused images           | `docker image prune`                                                  | `docker image prune`                                  |
| Save an image                  | `docker save <image_name>:tag \| gzip > <image_name>.tar.gz`          | `docker save myapp:tag \| gzip > myapp.tar.gz`        |
| Load an image                  | `gunzip -c <image_name>.tar.gz \| docker load`                        | `gunzip -c myapp.tar.gz \| docker load`               |
| Push an image to Docker Hub    | `docker push <image_name:tag>`                                        | `docker push myapp:v1`                                |
| Pull an image from Docker Hub  | `docker pull <image_name:tag>`                                        | `docker pull nginx:latest`                            |

</details>
<details> <summary>Docker Container</summary>

| Description                                          | Complete Command                                                                                               | Example                                                                   |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Create and Run a named container from an image       | `docker run --name <container_name> -d <image_name:tag>`                                                       | `docker run --name my_container -d myapp:v1`                              |
| Run a named container with port mapping              | `docker run -d --name <container_name> -p <host_port>:<container_port> <image_name:tag>`                       | `docker run -d --name my_container -p 8080:3000 myapp:v1`                 |
| Run a named container with port mapping and env file | `docker run -d --name <container_name> -p <host_port>:<container_port> --env-file <env_path> <image_name:tag>` | `docker run -d --name my_container -p 8080:3000 --env-file .env myapp:v1` |
| List all running containers                          | `docker ps`                                                                                                    | `docker ps`                                                               |
| List all containers (including stopped ones)         | `docker ps -a`                                                                                                 | `docker ps -a`                                                            |
| Inspect details of a container                       | `docker inspect <container_name_or_id>`                                                                        | `docker inspect my_container`                                             |
| Stop a running container                             | `docker stop <container_name_or_id>`                                                                           | `docker stop my_container`                                                |
| Start a stopped container                            | `docker start <container_name_or_id>`                                                                          | `docker start my_container`                                               |
| Pause a running container                            | `docker pause <container_name_or_id>`                                                                          | `docker pause my_container`                                               |
| Unpause a paused container                           | `docker unpause <container_name_or_id>`                                                                        | `docker unpause my_container`                                             |
| Remove a stopped container                           | `docker rm <container_name_or_id>`                                                                             | `docker rm my_container`                                                  |
| Remove a running container (forcefully)              | `docker rm -f <container_name_or_id>`                                                                          | `docker rm -f my_container`                                               |
| View container logs                                  | `docker logs <container_name_or_id>`                                                                           | `docker logs my_container`                                                |

</details>

<details> <summary>Docker Compose</summary>
<details> <summary>Click to expand folder structure and docker-compose.yml file</summary>
</details>

| Description                                               | Complete Command                                                     | Example                              |
| --------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------ |
| Create and start containers defined in docker-compose.yml | `docker compose up`                                                  | `docker compose up`                  |
| Stop and remove containers defined in docker-compose.yml  | `docker compose down`                                                | `docker compose down`                |
| Build or rebuild services                                 | `docker compose build`                                               | `docker compose build`               |
| List containers for a specific Docker Compose project     | `docker compose ps`                                                  | `docker compose ps`                  |
| View logs for services                                    | `docker compose logs`                                                | `docker compose logs`                |
| Scale services to a specific number of containers         | `docker compose up -d --scale <service_name>=<number_of_containers>` | `docker compose up -d --scale web=3` |
| Run a one-time command in a service                       | `docker compose run <service_name> <command>`                        | `docker compose run web npm install` |
| List all volumes (including compose volumes)              | `docker volume ls`                                                   | `docker volume ls`                   |
| Pause a service                                           | `docker compose pause <service_name>`                                | `docker compose pause web`           |
| Unpause a service                                         | `docker compose unpause <service_name>`                              | `docker compose unpause web`         |
| View details of a service                                 | `docker compose ps <service_name>`                                   | `docker compose ps web`              |

</details>
