# Quick Reference Guide

Essential commands and information for daily development.

---

## Common Commands

### Starting the Application

**Docker (Recommended):**
```bash
docker-compose up -d
```

**Manual:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - Database (if not using Docker)
# Start PostgreSQL service
```

### Stopping the Application

**Docker:**
```bash
docker-compose down
```

**Manual:**
Press `Ctrl+C` in each terminal

---

## Backend Commands

```bash
cd backend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

### Database Commands (Prisma)

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio

# Format schema
npx prisma format

# Validate schema
npx prisma validate
```

---

## Frontend Commands

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Run E2E tests
npm run test:e2e
npm run test:e2e:open

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

---

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Start and rebuild
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Restart services
docker-compose restart

# Execute commands in container
docker-compose exec backend bash
docker-compose exec backend npx prisma studio
docker-compose exec db psql -U postgres -d bankdb

# View running containers
docker-compose ps

# Build specific service
docker-compose build backend
docker-compose build frontend
```

---

## Git Workflow

### Branch Strategy

```bash
# Main branches
main        # Production-ready code
develop     # Integration branch

# Feature branches
feature/auth-system
feature/dashboard-ui
feature/transactions

# Bugfix branches
bugfix/login-error
bugfix/balance-calculation

# Hotfix branches
hotfix/security-patch
```

### Common Git Commands

```bash
# Create feature branch
git checkout -b feature/feature-name develop

# Commit changes
git add .
git commit -m "feat: add user authentication"

# Push to remote
git push origin feature/feature-name

# Update from develop
git checkout develop
git pull
git checkout feature/feature-name
git merge develop

# Squash commits before PR
git rebase -i develop
```

### Commit Message Convention

```bash
# Format: <type>: <description>

feat: add user login functionality
fix: resolve balance calculation error
docs: update API documentation
style: format code with prettier
refactor: restructure auth service
test: add unit tests for transactions
chore: update dependencies
```

---

## Environment URLs

### Development

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| API Docs | http://localhost:5000/api-docs |
| Prisma Studio | http://localhost:5555 |
| Database | localhost:5432 |

### Production (to be configured)

| Service | URL |
|---------|-----|
| Frontend | https://yourdomain.com |
| Backend API | https://api.yourdomain.com |
| API Docs | https://api.yourdomain.com/docs |

---

## Demo Credentials

### Regular User
```
Email: user@demo.com
Password: Demo123!
```

### Admin User
```
Email: admin@demo.com
Password: Admin123!
```

---

## API Endpoints Quick Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password

### Accounts
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `GET /api/accounts/:id/transactions` - Get account transactions

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `PATCH /api/transactions/:id/category` - Update category

### Cards
- `GET /api/cards` - Get all cards
- `GET /api/cards/:id` - Get card by ID
- `PATCH /api/cards/:id/status` - Toggle card status
- `POST /api/cards` - Request new card

### Transfers
- `POST /api/transfers` - Create transfer
- `GET /api/transfers` - Get transfer history
- `POST /api/transfers/external` - External transfer

### Analytics
- `GET /api/analytics/spending-by-category` - Spending breakdown
- `GET /api/analytics/income-vs-spending` - Income vs spending
- `GET /api/analytics/trends` - Monthly trends

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/deactivate` - Deactivate user
- `GET /api/admin/stats` - System statistics

---

## Database Schema Quick Reference

### Main Tables
- **User** - User accounts
- **Account** - Bank accounts
- **Card** - Debit/Credit cards
- **Transaction** - All transactions
- **Transfer** - Money transfers

### Relationships
```
User (1) ----< (many) Account
Account (1) ----< (many) Card
Account (1) ----< (many) Transaction
Card (1) ----< (many) Transaction
Account (1) ----< (many) Transfer (from)
Account (1) ----< (many) Transfer (to)
```

---

## File Structure Quick Reference

```
banking-app/
├── backend/
│   ├── prisma/          # Database schema & migrations
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utilities
│   └── tests/           # Tests
├── frontend/
│   ├── src/
│   │   ├── api/         # API clients
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   └── types/       # TypeScript types
│   └── public/          # Static files
└── docs/                # Documentation
```

---

## Troubleshooting Quick Fixes

### Port already in use
```bash
# Find process using port
lsof -ti:3000
lsof -ti:5000

# Kill process
kill -9 $(lsof -ti:3000)
```

### Database connection failed
```bash
# Check if PostgreSQL is running
docker-compose ps db
pg_isready -h localhost -p 5432

# Restart database
docker-compose restart db
```

### Prisma Client not generated
```bash
cd backend
npx prisma generate
```

### Module not found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker issues
```bash
# Reset everything
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

## VS Code Shortcuts

| Action | Shortcut (Mac) | Shortcut (Windows/Linux) |
|--------|----------------|--------------------------|
| Format document | `Shift+Option+F` | `Shift+Alt+F` |
| Open command palette | `Cmd+Shift+P` | `Ctrl+Shift+P` |
| Quick open file | `Cmd+P` | `Ctrl+P` |
| Toggle terminal | `Ctrl+` | `Ctrl+` |
| Multi-cursor | `Cmd+Option+↓` | `Ctrl+Alt+↓` |
| Find in files | `Cmd+Shift+F` | `Ctrl+Shift+F` |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time | < 300ms |
| Page Load Time | < 2s |
| Test Coverage | > 70% |
| Lighthouse Score | > 90 |
| Build Time | < 60s |

---

## Useful Links

- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Jest Documentation](https://jestjs.io)
- [Cypress Documentation](https://docs.cypress.io)

---

**Last Updated:** 2025-10-27
