# Project Structure

This document outlines the complete folder structure for the Bank Dashboard application.

---

## Root Directory Structure

```
banking-app/
├── .github/                    # GitHub specific files
│   └── workflows/             # CI/CD workflows
│       ├── ci.yml            # Continuous Integration
│       └── deploy.yml        # Deployment pipeline
├── backend/                   # Backend Node.js application
│   ├── prisma/               # Prisma ORM files
│   │   ├── migrations/       # Database migrations
│   │   ├── schema.prisma     # Database schema definition
│   │   └── seed.ts          # Database seeding script
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   ├── database.ts
│   │   │   ├── jwt.ts
│   │   │   └── env.ts
│   │   ├── controllers/     # Route controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── account.controller.ts
│   │   │   ├── transaction.controller.ts
│   │   │   ├── card.controller.ts
│   │   │   ├── transfer.controller.ts
│   │   │   └── analytics.controller.ts
│   │   ├── middleware/      # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   └── rbac.middleware.ts
│   │   ├── models/          # Data models (if needed beyond Prisma)
│   │   │   └── index.ts
│   │   ├── routes/          # API route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── account.routes.ts
│   │   │   ├── transaction.routes.ts
│   │   │   ├── card.routes.ts
│   │   │   ├── transfer.routes.ts
│   │   │   ├── analytics.routes.ts
│   │   │   └── index.ts
│   │   ├── services/        # Business logic layer
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── account.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── card.service.ts
│   │   │   ├── transfer.service.ts
│   │   │   └── analytics.service.ts
│   │   ├── types/           # TypeScript type definitions
│   │   │   ├── express.d.ts
│   │   │   ├── auth.types.ts
│   │   │   ├── user.types.ts
│   │   │   └── api.types.ts
│   │   ├── utils/           # Utility functions
│   │   │   ├── logger.ts
│   │   │   ├── validators.ts
│   │   │   ├── errors.ts
│   │   │   └── helpers.ts
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── tests/               # Backend tests
│   │   ├── unit/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── integration/
│   │   │   └── api/
│   │   └── setup.ts
│   ├── .env.example         # Environment variables template
│   ├── .eslintrc.json       # ESLint configuration
│   ├── .prettierrc          # Prettier configuration
│   ├── Dockerfile           # Backend Docker image
│   ├── package.json         # Backend dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   └── jest.config.js       # Jest configuration
├── frontend/                 # Frontend React application
│   ├── public/              # Static files
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/
│   ├── src/
│   │   ├── api/            # API client layer
│   │   │   ├── axios.config.ts
│   │   │   ├── auth.api.ts
│   │   │   ├── user.api.ts
│   │   │   ├── account.api.ts
│   │   │   ├── transaction.api.ts
│   │   │   ├── card.api.ts
│   │   │   ├── transfer.api.ts
│   │   │   └── analytics.api.ts
│   │   ├── assets/         # Images, fonts, etc.
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   ├── components/     # React components
│   │   │   ├── common/    # Shared components
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Input/
│   │   │   │   ├── Card/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Table/
│   │   │   │   ├── Spinner/
│   │   │   │   └── index.ts
│   │   │   ├── layout/    # Layout components
│   │   │   │   ├── Header/
│   │   │   │   ├── Sidebar/
│   │   │   │   ├── Footer/
│   │   │   │   └── MainLayout/
│   │   │   ├── auth/      # Auth-related components
│   │   │   │   ├── LoginForm/
│   │   │   │   ├── RegisterForm/
│   │   │   │   └── ProtectedRoute/
│   │   │   ├── dashboard/ # Dashboard components
│   │   │   │   ├── AccountSummary/
│   │   │   │   ├── QuickStats/
│   │   │   │   ├── RecentTransactions/
│   │   │   │   └── CardsList/
│   │   │   ├── transactions/
│   │   │   │   ├── TransactionList/
│   │   │   │   ├── TransactionItem/
│   │   │   │   ├── TransactionFilters/
│   │   │   │   └── TransactionDetail/
│   │   │   ├── analytics/
│   │   │   │   ├── SpendingChart/
│   │   │   │   ├── IncomeChart/
│   │   │   │   ├── CategoryChart/
│   │   │   │   └── PeriodSelector/
│   │   │   ├── cards/
│   │   │   │   ├── CardGrid/
│   │   │   │   ├── CardItem/
│   │   │   │   └── CardDetail/
│   │   │   ├── transfer/
│   │   │   │   ├── TransferForm/
│   │   │   │   └── TransferConfirmation/
│   │   │   └── settings/
│   │   │       ├── ProfileSettings/
│   │   │       ├── SecuritySettings/
│   │   │       └── ThemeSettings/
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useTheme.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── pages/          # Page components
│   │   │   ├── Auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── Transactions/
│   │   │   │   └── Transactions.tsx
│   │   │   ├── Analytics/
│   │   │   │   └── Analytics.tsx
│   │   │   ├── Cards/
│   │   │   │   └── Cards.tsx
│   │   │   ├── Transfer/
│   │   │   │   └── Transfer.tsx
│   │   │   ├── Settings/
│   │   │   │   └── Settings.tsx
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   └── UserManagement.tsx
│   │   │   └── NotFound/
│   │   │       └── NotFound.tsx
│   │   ├── store/          # Redux store
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── userSlice.ts
│   │   │   │   ├── accountSlice.ts
│   │   │   │   ├── transactionSlice.ts
│   │   │   │   ├── cardSlice.ts
│   │   │   │   └── themeSlice.ts
│   │   │   ├── store.ts
│   │   │   └── hooks.ts
│   │   ├── styles/         # Global styles
│   │   │   ├── index.css
│   │   │   └── tailwind.css
│   │   ├── types/          # TypeScript types
│   │   │   ├── api.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── account.types.ts
│   │   │   ├── transaction.types.ts
│   │   │   └── card.types.ts
│   │   ├── utils/          # Utility functions
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   ├── App.tsx         # Main App component
│   │   ├── index.tsx       # Entry point
│   │   └── routes.tsx      # Route definitions
│   ├── .env.example        # Environment variables template
│   ├── .eslintrc.json      # ESLint configuration
│   ├── .prettierrc         # Prettier configuration
│   ├── Dockerfile          # Frontend Docker image
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── tsconfig.json       # TypeScript configuration
│   └── vite.config.ts      # Vite configuration
├── docs/                    # Documentation
│   ├── SRS.md              # Software Requirements Specification
│   ├── API_ENDPOINTS.md    # API documentation
│   ├── DATABASE_SCHEMA.md  # Database schema
│   ├── COMPONENT_HIERARCHY.md # Frontend components
│   ├── PROJECT_PLAN.md     # SDLC plan
│   └── ARCHITECTURE.md     # System architecture
├── docker/                  # Docker configurations
│   ├── nginx/
│   │   └── nginx.conf
│   └── postgres/
│       └── init.sql
├── scripts/                 # Utility scripts
│   ├── setup.sh            # Initial setup script
│   ├── deploy.sh           # Deployment script
│   └── backup.sh           # Database backup script
├── .dockerignore           # Docker ignore file
├── .gitignore              # Git ignore file
├── docker-compose.yml      # Docker Compose configuration
├── docker-compose.prod.yml # Production Docker Compose
├── README.md               # Project README
└── LICENSE                 # License file
```

---

## Directory Descriptions

### Backend (`/backend`)

**Purpose:** Node.js + Express + TypeScript API server

**Key Subdirectories:**
- `prisma/`: Database schema, migrations, and seed data
- `src/controllers/`: Request handlers for each route
- `src/services/`: Business logic layer
- `src/middleware/`: Express middleware (auth, validation, error handling)
- `src/routes/`: API route definitions
- `src/utils/`: Helper functions and utilities
- `tests/`: Unit and integration tests

### Frontend (`/frontend`)

**Purpose:** React + TypeScript + Redux Toolkit SPA

**Key Subdirectories:**
- `src/components/`: Reusable React components organized by feature
- `src/pages/`: Top-level page components
- `src/store/`: Redux Toolkit store and slices
- `src/api/`: API client functions
- `src/hooks/`: Custom React hooks
- `src/types/`: TypeScript type definitions

### Documentation (`/docs`)

**Purpose:** Project documentation

**Files:**
- `SRS.md`: Complete requirements specification
- `API_ENDPOINTS.md`: API endpoint documentation
- `DATABASE_SCHEMA.md`: Database schema and relationships
- `COMPONENT_HIERARCHY.md`: Frontend component structure
- `PROJECT_PLAN.md`: Development timeline and phases

### Docker (`/docker`)

**Purpose:** Docker-related configuration files

**Subdirectories:**
- `nginx/`: Nginx reverse proxy configuration
- `postgres/`: PostgreSQL initialization scripts

### Scripts (`/scripts`)

**Purpose:** Automation and utility scripts

**Files:**
- `setup.sh`: Initialize project environment
- `deploy.sh`: Automated deployment
- `backup.sh`: Database backup automation

---

## File Naming Conventions

### Backend
- **Controllers:** `*.controller.ts` (e.g., `auth.controller.ts`)
- **Services:** `*.service.ts` (e.g., `user.service.ts`)
- **Routes:** `*.routes.ts` (e.g., `account.routes.ts`)
- **Middleware:** `*.middleware.ts` (e.g., `auth.middleware.ts`)
- **Tests:** `*.test.ts` or `*.spec.ts`

### Frontend
- **Components:** PascalCase folder with `ComponentName.tsx`
- **Pages:** PascalCase (e.g., `Dashboard.tsx`)
- **Hooks:** camelCase starting with `use` (e.g., `useAuth.ts`)
- **Types:** `*.types.ts` (e.g., `user.types.ts`)
- **Tests:** `*.test.tsx` or `*.spec.tsx`

---

## Environment Variables

### Backend (`.env`)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/bankdb
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Bank Dashboard
```

---

## Next Steps

1. Create the directory structure
2. Initialize backend with Express + TypeScript
3. Initialize frontend with Vite + React + TypeScript
4. Setup Docker and Docker Compose
5. Configure CI/CD pipelines
6. Begin Phase 1 development

---

**Last Updated:** 2025-10-27
