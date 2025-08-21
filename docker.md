# Docker

<details>
<summary>Click to expand folder structure</summary>

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
├─ docker-compose.yml         # Optional compose file
├─ Dockerfile                 # Production Dockerfile (multi-stage)
├─ Dockerfile.dev             # Development Dockerfile (single-stage)
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

<details>
<summary>Development vs Production (Docker Strategy)</summary>

| Aspect | Development Phase | Production Phase |
|--------|------------------|------------------|
| **Dockerfile Type** | Single-stage | Multi-stage |
| **Base Image** | Minimal (e.g., `node:18-alpine`) | Minimal (e.g., `node:18-alpine`) |
| **Dependencies** | Install **all deps** (including devDeps) | Install **only production deps** (`npm ci --only=production`) |
| **Build Output** | -- | Copy `dist/` build output |
| **Cache & Temp Files** | -- (speed > size) | Cleared (`npm cache clean --force`, remove `/tmp`) |
| **Layer Optimization** | Combine `RUN` commands | Combine `RUN` commands |
| **Environment Files** | `.env.dev` | `.env.prod`, `.env.staging` |
| **Volumes** | Use volumes for hot reload | -- |
| **User** | Root (default) | Non-root user required |
| **Healthcheck** | -- | Required for container |
| **OCI Labels** | Optional | Required (metadata: maintainer, version, etc.) |
| **Image Scanning** | -- | Required (security compliance) |
| **Debugging** | Use `RUN echo ...` for inspection | -- |

</details>


<details>
<summary>Click to expand Dockerfile.dev (Development)</summary>

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

RUN echo "Running in $NODE_ENV mode and node version is $NODE_VERSION"

CMD ["npm", "run", "start:dev"]
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

<details> <summary>Docker Images</summary>

| Description | Complete Command | Example |
|-------------|------------------|---------|
| Build an image | `docker build -f Dockerfile -t <image_name>:tag <path_to_dockerfile>` | `docker build -f Dockerfile.dev -t myapp:dev .` |
| List all local images | `docker images` | `docker images` |
| Inspect details of an image | `docker inspect image <image_name:tag>` | `docker inspect image myapp:v1` |
| Tag an image/ rename the image | `docker tag <source_image:tag> <new_image:tag>` | `docker tag myapp:latest my-app:v1` |
| Remove a local image | `docker rmi <image_name:tag>` | `docker rmi myapp:latest` |
| Remove image by ID | `docker rm <image_name/image_id>` | `docker rm fd484f19954f` |
| Remove unused images | `docker image prune` | `docker image prune` |
| Save an image | `docker save <image_name>:tag \| gzip > <image_name>.tar.gz` | `docker save myapp:tag \| gzip > myapp.tar.gz` |
| Load an image | `gunzip -c <image_name>.tar.gz \| docker load` | `gunzip -c myapp.tar.gz \| docker load` |
| Push an image to Docker Hub | `docker push <image_name:tag>` | `docker push myapp:v1` |
| Pull an image from Docker Hub | `docker pull <image_name:tag>` | `docker pull nginx:latest` |

</details>
