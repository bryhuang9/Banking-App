# Setup Guide

Complete step-by-step guide to set up the Bank Dashboard application for development.

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v9.0.0 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/))

### Optional (for manual database setup)
- **PostgreSQL** v15 or higher ([Download](https://www.postgresql.org/))
- **pgAdmin** or another PostgreSQL client

### Verification

Check your installations:
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
git --version     # Should show 2.x.x or higher
docker --version  # Should show 20.x.x or higher
docker-compose --version  # Should show 2.x.x or higher
```

---

## Setup Options

Choose one of the following setup methods:

1. **Quick Start with Docker** (Recommended for beginners)
2. **Manual Setup** (For detailed control)

---

## Option 1: Quick Start with Docker

This method sets up everything automatically using Docker Compose.

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/banking-app.git
cd banking-app
```

### Step 2: Create Environment Files

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` if needed (optional for Docker setup):
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@db:5432/bankdb
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

**Frontend:**
```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env` if needed:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Bank Dashboard
```

### Step 3: Start Docker Compose

```bash
cd ..
docker-compose up -d
```

This command will:
- Build the backend and frontend images
- Start PostgreSQL database
- Run database migrations
- Seed the database with sample data
- Start all services

### Step 4: Verify Services

Check that all containers are running:
```bash
docker-compose ps
```

You should see:
- `banking-app-backend`
- `banking-app-frontend`
- `banking-app-db`

### Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Documentation:** http://localhost:5000/api-docs

### Step 6: Login

Use the demo credentials:
```
Email: user@demo.com
Password: Demo123!
```

### Common Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Execute commands in container
docker-compose exec backend npm run prisma:studio
docker-compose exec backend npx prisma migrate reset
```

---

## Option 2: Manual Setup

This method gives you more control and is better for development.

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/banking-app.git
cd banking-app
```

### Step 2: Set Up PostgreSQL Database

**Option A: Use Docker for PostgreSQL only**
```bash
docker run --name bankdb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bankdb \
  -p 5432:5432 \
  -d postgres:15
```

**Option B: Use local PostgreSQL installation**

1. Start PostgreSQL service
2. Create a database:
```bash
psql -U postgres
CREATE DATABASE bankdb;
\q
```

### Step 3: Set Up Backend

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bankdb
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

Run database migrations:
```bash
npx prisma migrate dev
```

Seed the database:
```bash
npx prisma db seed
```

Start the backend server:
```bash
npm run dev
```

The backend should be running on http://localhost:5000

### Step 4: Set Up Frontend

Open a new terminal window:

```bash
cd frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Bank Dashboard
```

Start the frontend development server:
```bash
npm run dev
```

The frontend should be running on http://localhost:3000

### Step 5: Verify Setup

1. Open http://localhost:3000 in your browser
2. Try logging in with demo credentials:
   - Email: `user@demo.com`
   - Password: `Demo123!`
3. Check the backend API: http://localhost:5000/api/health
4. View API docs: http://localhost:5000/api-docs

---

## Project Structure Setup

After cloning, you should create the complete folder structure:

```bash
# Backend structure
cd backend
mkdir -p src/{config,controllers,middleware,models,routes,services,types,utils}
mkdir -p tests/{unit,integration}
mkdir -p prisma/migrations

# Frontend structure
cd ../frontend
mkdir -p src/{api,assets/{images,icons,fonts},components/{common,layout,auth,dashboard,transactions,analytics,cards,transfer,settings,admin},hooks,pages,store/slices,styles,types,utils}
mkdir -p public/assets
```

---

## Development Workflow

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Prisma Studio (Optional):**
```bash
cd backend
npx prisma studio
```

### Making Database Changes

1. **Modify the schema:**
```bash
cd backend
# Edit prisma/schema.prisma
```

2. **Create and apply migration:**
```bash
npx prisma migrate dev --name your_migration_name
```

3. **Reset database (if needed):**
```bash
npx prisma migrate reset
```

### Running Tests

**Backend tests:**
```bash
cd backend
npm test
npm run test:watch
npm run test:coverage
```

**Frontend tests:**
```bash
cd frontend
npm test
npm run test:watch
npm run test:coverage
```

**E2E tests:**
```bash
cd frontend
npm run test:e2e
```

---

## IDE Setup

### VSCode (Recommended)

Install recommended extensions:
- ESLint
- Prettier
- Prisma
- TypeScript
- Tailwind CSS IntelliSense
- Docker
- GitLens

**Workspace settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## Troubleshooting

### Port Already in Use

If ports 3000 or 5000 are already in use:

**Change backend port:**
Edit `backend/.env`:
```env
PORT=5001
```

**Change frontend proxy:**
Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### Database Connection Issues

**Check PostgreSQL is running:**
```bash
docker-compose ps db
# or
pg_isready -h localhost -p 5432
```

**Verify DATABASE_URL:**
Make sure the connection string in `backend/.env` is correct.

**Reset database:**
```bash
cd backend
npx prisma migrate reset
```

### Module Not Found

**Clear node_modules and reinstall:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Prisma Client Not Generated

```bash
cd backend
npx prisma generate
```

### Docker Issues

**Reset Docker environment:**
```bash
docker-compose down -v
docker-compose up -d --build
```

**Check Docker logs:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### CORS Errors

Make sure `CORS_ORIGIN` in `backend/.env` matches your frontend URL:
```env
CORS_ORIGIN=http://localhost:3000
```

### TypeScript Errors

**Rebuild TypeScript:**
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

---

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| NODE_ENV | Environment mode | development | Yes |
| PORT | Backend server port | 5000 | Yes |
| DATABASE_URL | PostgreSQL connection string | - | Yes |
| JWT_SECRET | Secret key for JWT | - | Yes |
| JWT_EXPIRES_IN | JWT expiration time | 7d | Yes |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 | Yes |

### Frontend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api | Yes |
| VITE_APP_NAME | Application name | Bank Dashboard | No |

---

## Next Steps

After successful setup:

1. **Review the documentation:**
   - [SRS.md](./SRS.md) - Requirements
   - [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API reference
   - [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database structure
   - [COMPONENT_HIERARCHY.md](./COMPONENT_HIERARCHY.md) - Frontend components

2. **Start development:**
   - Follow [PROJECT_PLAN.md](./PROJECT_PLAN.md)
   - Begin with Phase 1: Backend Core Implementation

3. **Explore the code:**
   - Check out the seeded data in Prisma Studio
   - Review the API endpoints in Swagger docs
   - Inspect the database schema

4. **Set up Git hooks (optional):**
```bash
npm install -g husky
npx husky install
```

---

## Getting Help

- Review the [README.md](../README.md)
- Check [Troubleshooting](#troubleshooting) section above
- Open an issue on GitHub
- Review error logs carefully

---

**Last Updated:** 2025-10-27
