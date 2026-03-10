# Prueba Técnica: Fullstack Project (Node.js, Prisma & React)

Esta es la prueba tecnica completa con una API robusta en el backend y una interfaz interactiva en el frontend. Implementando autenticación JWT, Control de Acceso Basado en Roles (RBAC), validaciones estrictas con Zod y persistencia en PostgreSQL mediante Prisma.

---

## Requisitos Previos

- **Docker & Docker Compose** (instalados y en ejecución)
- **Node.js v18+** (opcional para ejecución local)
- **NPM** (gestor de paquetes)

---

## Instrucciones de Ejecución

### 1. Preparación del Entorno

Cree un archivo `.env` en la raíz del proyecto (basado en el contenido listado abajo) antes de iniciar los servicios.

### 2. Levantar con Docker (Full Stack)

Levante la base de datos, el backend y el frontend simultáneamente:

```bash
# Iniciar todo el ecosistema
docker-compose up -d --build
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### 3. Sincronizar Base de Datos y Seeders

Este paso es crucial para crear las tablas y los usuarios de prueba. Puede hacerlo directamente desde Docker (recomendado) o localmente.

**Opción A: Desde Docker (Recomendado)**

```bash
# Ejecute migraciones y seeder dentro del contenedor de backend
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npx prisma db seed
```

**Opción B: Desde su máquina local (Requiere Node.js)**

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Iniciar el Frontend

En una nueva terminal:

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Usuarios de Prueba

Utilice estas credenciales para probar los diferentes niveles de permisos (RBAC):

| Email             | Password     | Rol        | Permisos                                  |
| :---------------- | :----------- | :--------- | :---------------------------------------- |
| `admin@demo.com`  | `Admin#123`  | **Admin**  | Acceso total (Borrar, Editar, Crear, Ver) |
| `editor@demo.com` | `Editor#123` | **Editor** | Crear, Editar y Ver (No puede borrar)     |
| `viewer@demo.com` | `Viewer#123` | **Viewer** | Solo lectura (Ver tabla y filtros)        |

---

## Decisiones Técnicas

- **Validación con Zod**: Se eligió Zod tanto en el Backend como en el Frontend para garantizar que los datos cumplan con los esquemas antes de ser procesados. Esto reduce errores en tiempo de ejecución y proporciona mensajes de error claros al usuario.
- **RBAC (Role-Based Access Control)**:
  - **Backend**: Implementado mediante un middleware personalizado (`roleMiddleware`) que intercepta las peticiones y verifica el rol inyectado en el JWT.
  - **Frontend**: Los componentes se renderizan de forma condicional basándose en el rol decodificado del token. Las rutas están protegidas mediante el componente `ProtectedRoute`.
- **Axios Interceptors**: Se configuró un sistema centralizado para adjuntar el token de autenticación a cada petición y capturar errores 401/403 globalmente para redigir al usuario o mostrar notificaciones (Toasts).
- **Prisma**: Elegido como ORM por su potente generación de tipos, facilitando la consistencia de datos en la entidad `Records`.

---

## Variables de Entorno (.env)

Asegúrese de configurar estas variables en un archivo `.env` en la raíz (root) del proyecto:

```env
# Importante: Use 'db' si corre en Docker, o 'localhost' si corre local sin contenedores
DATABASE_URL="postgresql://postgres:postgres@db:5432/postgres?schema=public"
JWT_SECRET="Secret_ejemplo"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"

# Credenciales para PostgreSQL (Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
```

---

## Estructura del Proyecto

- `/backend`: API modularizada (controllers, middlewares, routes, services, schemas).
- `/frontend`: Aplicación React con Vite, TypeScript y Vanilla Premium CSS.
- `/prisma`: Esquema de datos, migraciones y seeders.

---

## Scripts Disponibles (Backend)

- `npm run dev`: Servidor con hot-reload.
- `npm run prisma:migrate`: Cree y aplique migraciones.
- `npm run prisma:seed`: Ejecute el seeder (llena la base de datos).
- `npm test`: Ejecute tests con Jest e Integration tests.
