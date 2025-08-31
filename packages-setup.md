# Packages Setup

<details><summary>React Vite with TypeScript</summary>

- Docs
  - [sonner](https://sonner.emilkowal.ski/)

```bash
npm create vite@latest

npm install react-router-dom

npm install react-redux @reduxjs/toolkit

npm install react-hook-form @hookform/resolvers zod

npm i @tanstack/react-query axios

npm i sonner
```

</details>

<details><summary>NestJS</summary>

```bash
npm install -g @nestjs/cli

nest new <project-name>
nest new .

npm run start:dev

nest g module <module-name>
nest g module <module-name> --no-spec

nest g controller <controller-name>
nest g controller <controller-name> --no-spec

nest g service <service-name>
nest g service <service-name> --no-spec

nest g app <app-name>

npm start <app-name>
npm run start:dev

npm i @nestjs/mongoose mongoose @nestjs/config class-validator class-transformer @nestjs/jwt bcrypt
```

- To delete apps in NestJS
  - Delete the App Folder
  - Remove References from Configuration Files: `nest-cli.json`, `tsconfig.json`, `package.json (Optional
  - Reinstall Dependencies: `npm i`

</details>

<details><summary>Express</summary>

```bash
npm init

npm i express
```

</details>

<details><summary>Tailwind CSS for React Vite</summary>

```bash
npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p

# Configure your template paths to the `tailwind.config.js` file.
content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
],

# Add the Tailwind directives to your `./src/index.css` file.
@tailwind base;
@tailwind components;
@tailwind utilities;

# Installation of `prettier-plugin-tailwindcss` for automatic class sorting with Prettier
npm install -D prettier prettier-plugin-tailwindcss

# Create a file named `.prettierrc` in the root directory
{
"plugins": ["prettier-plugin-tailwindcss"]
}
```

</details>

<details><summary>Bootstrap for React Vite</summary>

```bash
npm install bootstrap

# Import Bootstrap CSS `src/main.jsx`
import 'bootstrap/dist/css/bootstrap.min.css';

# Install Bootstrap [Icons](<https://icons.getbootstrap.com/>)
npm install bootstrap-icons

# Import Bootstrap Icons CSS `src/main.jsx`
import 'bootstrap-icons/font/bootstrap-icons.css';

# Pre-defined icon size
- `.fs-1`: Makes the icon very large (around 3.5rem)
- `.fs-2`: Makes the icon large (around 3rem)
- `.fs-3`: Makes the icon medium-large (around 2.5rem)
- `.fs-4`: Makes the icon medium (around 2rem)
- `.fs-5`: Makes the icon medium-small (around 1.5rem)
- `.fs-6`: Makes the icon small (around 1rem)

or you can use `fontSize`

- <i className="bi bi-check" `style={{ fontSize: '2em' }}`></i>
```

</details>

<details><summary>PIP (Python Package Manager)</summary>

```bash
pip --version
python.exe -m pip install --upgrade pip

pip list

pip list --outdated

pip install <package-name>
pip install 'ruff==0.3.0'
pip install -r requirements.txt

pip install --upgrade <package-name>

pip uninstall <package-name>

pip freeze > requirements.txt
```

</details>

<details><summary>UV Virtual Environment (Python)</summary>

```bash
pip install uv

uv venv
uv venv <my-venv>

source .venv/Scripts/activate
source <my-venv>/Scripts/activate

deactivate

uv pip list

uv pip install <package_name>
uv pip install 'ruff==0.3.0'
uv pip install -r requirements.txt

uv pip install --upgrade <package-uv>

uv pip uninstall <package_name>

uv pip freeze > requirements.txt
```

</details>

<details><summary>NPM (Node Package Manager)</summary>

```bash
npm -v
npm install -g npm@latest

npm list
npm list -g

npm outdated

npm install <package-name>
npm install -g <package-name>

npm update <package-name>
npm update -g <package-name>

npm uninstall <package-name>
npm uninstall -g <package-name>

npm cache clean
npm cache clean --force

```

</details>

<details><summary>NVM (Node Version Manager)</summary>

- Manually download and install the latest version from: [nvm-windows](https://github.com/coreybutler/nvm-windows)

```bash
nvm version
nvm upgradenpm install -D tailwindcss postcss autoprefixer

nvm current

nvm list
nvm list available

nvm install <version-20,22,24....>
nvm reinstall <version>

nvm use <version>

nvm uninstall <version>
```

</details>

<details><summary>Python Version Management</summary>

- Refer this docs [pyenv](https://github.com/pyenv/pyenv.git)

</details>

<details>
<summary>Prisma Setup for NestJS with PostgreSQL</summary>
<details>
<summary>Installation</summary>

```bash
npm install prisma @prisma/client
npm install -D prisma

nest g module prisma --no-spec
nest g controller prisma --no-spec
nest g service prisma --no-spec
```

</details>
<details>
<summary>Automatically created by running above CMD (Folder Structure)</summary>

```
├── prisma/
│   ├── prisma.module.ts
│   ├── prisma.service.ts
│   └── schema.prisma
```

</details>

<details>
<summary>schema.prisma</summary>

```env
generator client {
    provider = "prisma-client-js"
}


// DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?schema=public"
datasource db {
    provider = "postgresql"
    url      = "postgresql://postgres:postgres@localhost:5932/master_db?schema=public"
}

model Role {
    id          String   @id @default(uuid())
    name        String
    ...
}
```

</details>

<details><summary>Prisma Commands</summary>

```tsx
# Generate Prisma Client (always do this after schema changes)
npx prisma generate

# Run Migrations (only if you changed schema and want to apply to DB)
npx prisma migrate dev --name init

# Deploy migrations to production
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

</details>
