# Nest.js

**Start the application:**

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

**Set up database:**

```bash
# Generate Prisma Client (always do this after schema changes)
npx prisma generate
npx prisma generate --schema=./src/shared/prisma/schema.prisma

# Run Migrations (only if you changed schema and want to apply to DB)
npx prisma migrate dev --name init
npx prisma migrate dev --name init --schema=./src/shared/prisma/schema.prisma


# Deploy migrations to production
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```
