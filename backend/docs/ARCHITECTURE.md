# Architecture Documentation

System architecture and design patterns for the Banking API.

---

## Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Architecture Patterns](#architecture-patterns)
- [Project Structure](#project-structure)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Database Schema](#database-schema)
- [Middleware Stack](#middleware-stack)

---

## System Overview

The Banking API is a RESTful backend service built with Node.js, TypeScript, and Express.js. It provides secure authentication, user management, and account viewing capabilities for a banking dashboard application.

### Key Features

- **Authentication & Authorization** - JWT-based auth with role-based access control
- **User Management** - Profile management and password changes
- **Account Management** - View accounts and transaction history
- **Security** - Rate limiting, security headers, input validation
- **Monitoring** - Request logging and error tracking

### Architecture Diagram

```
┌──────────────┐
│   Frontend   │
│  (React/    │
│   Next.js)   │
└──────┬───────┘
       │ HTTP/HTTPS
       │
┌──────▼────────────────────────────────────────────┐
│              API Gateway                           │
│  - Rate Limiting                                  │
│  - CORS                                           │
│  - Security Headers                               │
└──────┬────────────────────────────────────────────┘
       │
┌──────▼────────────────────────────────────────────┐
│           Express Application                      │
│  ┌──────────────────────────────────────────┐    │
│  │         Middleware Stack                  │    │
│  │  1. Helmet (Security Headers)            │    │
│  │  2. Morgan (Request Logging)             │    │
│  │  3. CORS (Cross-Origin)                  │    │
│  │  4. Rate Limiter                         │    │
│  │  5. Body Parser                          │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │            Routes Layer                   │    │
│  │  - Auth Routes                           │    │
│  │  - User Routes                           │    │
│  │  - Account Routes                        │    │
│  └──────┬───────────────────────────────────┘    │
│         │                                          │
│  ┌──────▼───────────────────────────────────┐    │
│  │         Controllers Layer                 │    │
│  │  - Request Validation                    │    │
│  │  - Call Services                         │    │
│  │  - Format Responses                      │    │
│  └──────┬───────────────────────────────────┘    │
│         │                                          │
│  ┌──────▼───────────────────────────────────┐    │
│  │          Services Layer                   │    │
│  │  - Business Logic                        │    │
│  │  - Data Validation                       │    │
│  │  - Database Queries                      │    │
│  └──────┬───────────────────────────────────┘    │
│         │                                          │
│  ┌──────▼───────────────────────────────────┐    │
│  │          Prisma ORM                      │    │
│  │  - Type-Safe Queries                     │    │
│  │  - Migrations                            │    │
│  │  - Schema Management                     │    │
│  └──────┬───────────────────────────────────┘    │
└─────────┼────────────────────────────────────────┘
          │
┌─────────▼────────────┐
│   PostgreSQL         │
│   Database           │
│  - Users             │
│  - Accounts          │
│  - Transactions      │
│  - Cards             │
│  - Transfers         │
└──────────────────────┘
```

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime |
| **TypeScript** | 5.x | Type safety |
| **Express.js** | 4.x | Web framework |
| **PostgreSQL** | 15.x | Relational database |
| **Prisma** | 5.x | ORM and migrations |

### Security & Middleware

| Package | Purpose |
|---------|---------|
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT authentication |
| **helmet** | Security headers |
| **cors** | Cross-origin requests |
| **express-rate-limit** | Rate limiting |
| **morgan** | Request logging |
| **zod** | Input validation |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ts-node** | TypeScript execution |
| **nodemon** | Auto-restart on changes |
| **eslint** | Code linting |
| **prettier** | Code formatting |

---

## Architecture Patterns

### 1. MVC (Model-View-Controller)

The application follows the MVC pattern with a clear separation of concerns:

```
Request Flow:
Client → Routes → Controllers → Services → Database
                                     ↓
Response Flow:                       
Client ← Controllers ← Services ← Database
```

**Routes** - Define URL endpoints and HTTP methods  
**Controllers** - Handle HTTP requests/responses  
**Services** - Business logic and database operations  
**Models** - Prisma schema definitions

### 2. Layered Architecture

```
┌─────────────────────────────┐
│    Presentation Layer       │  Routes, Controllers
│  (HTTP Request/Response)    │  - Validates input
├─────────────────────────────┤  - Formats output
│    Business Logic Layer     │  Services
│   (Application Logic)       │  - Business rules
├─────────────────────────────┤  - Authorization
│    Data Access Layer        │  Prisma ORM
│   (Database Operations)     │  - Queries
├─────────────────────────────┤  - Transactions
│    Database Layer           │  PostgreSQL
│   (Data Storage)            │  - Data persistence
└─────────────────────────────┘
```

### 3. Singleton Pattern

Services and controllers use singleton instances:

```typescript
export class AuthService {
  // Single instance
}

export const authService = new AuthService();
```

**Benefits:**
- Single source of truth
- Memory efficient
- Easy to test

### 4. Middleware Pattern

Express middleware for cross-cutting concerns:

```typescript
app.use(helmet());        // Security
app.use(requestLogger);   // Logging
app.use(authenticate);    // Auth
```

**Benefits:**
- Reusable
- Composable
- Testable

### 5. Factory Pattern

Validation middleware factory:

```typescript
export const validate = (schema: ZodSchema) => {
  return async (req, res, next) => {
    // Validation logic
  };
};
```

**Usage:**
```typescript
router.post('/register', validate(registerSchema), controller.register);
```

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Migration history
│   └── seed.ts               # Seed data
│
├── src/
│   ├── config/               # Configuration
│   │   ├── database.ts       # DB connection
│   │   ├── env.ts            # Environment variables
│   │   └── jwt.ts            # JWT configuration
│   │
│   ├── controllers/          # HTTP request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── account.controller.ts
│   │
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── validate.middleware.ts
│   │
│   ├── routes/               # Route definitions
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── account.routes.ts
│   │
│   ├── services/             # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── account.service.ts
│   │
│   ├── types/                # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   └── account.types.ts
│   │
│   ├── utils/                # Utility functions
│   │   └── errors.ts
│   │
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
│
├── docs/                     # Documentation
│   ├── API.md
│   ├── TESTING.md
│   └── ARCHITECTURE.md
│
├── .env                      # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # Project overview
```

### File Responsibilities

**Config Files:**
- `database.ts` - Prisma client setup
- `env.ts` - Environment validation with Zod
- `jwt.ts` - JWT signing and verification

**Controllers:**
- Validate requests
- Call services
- Format responses
- Handle errors

**Services:**
- Business logic
- Database operations
- Data validation
- Authorization checks

**Middleware:**
- Authentication
- Rate limiting
- Request logging
- Error handling
- Input validation

**Routes:**
- Define endpoints
- Apply middleware
- Route to controllers

---

## Data Flow

### Authentication Flow

```
1. User Login Request
   ↓
2. Route: POST /api/auth/login
   ↓
3. authLimiter checks rate limit
   ↓
4. authController.login validates input
   ↓
5. authService.login:
   - Find user by email
   - Verify password with bcrypt
   - Generate JWT token
   ↓
6. Return user + token
   ↓
7. Client stores token
```

### Protected Request Flow

```
1. Client Request with Token
   ↓
2. Route: GET /api/user/profile
   ↓
3. authenticate middleware:
   - Extract token from header
   - Verify JWT signature
   - Decode user info
   - Attach to req.user
   ↓
4. userController.getProfile
   ↓
5. userService.getProfile(userId):
   - Query database
   - Find user by ID
   - Return user data
   ↓
6. Return user profile
```

### Error Flow

```
1. Error occurs in service
   ↓
2. Throw custom error (e.g., UnauthorizedError)
   ↓
3. Express catches error
   ↓
4. errorHandler middleware:
   - Format error response
   - Log error
   - Send to client
   ↓
5. Client receives error
```

---

## Security Architecture

### Defense in Depth

Multiple security layers protect the application:

```
Layer 1: Network Security
  - HTTPS only (production)
  - Firewall rules

Layer 2: Application Security
  - Helmet security headers
  - CORS restrictions
  - Rate limiting

Layer 3: Authentication
  - JWT tokens
  - Password hashing (bcrypt)
  - Token expiration

Layer 4: Authorization
  - Role-based access
  - Resource ownership checks
  - User verification

Layer 5: Input Validation
  - Zod schema validation
  - SQL injection prevention (Prisma)
  - XSS prevention

Layer 6: Data Protection
  - No passwords in logs
  - No sensitive data in responses
  - Database encryption (at rest)
```

### JWT Authentication

```typescript
// Token Structure
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "USER",
    "iat": 1704960000,
    "exp": 1705564800
  },
  "signature": "..."
}
```

**Token Lifecycle:**
1. User logs in
2. Server generates JWT (7-day expiration)
3. Client stores token
4. Client sends token in Authorization header
5. Server verifies token on each request
6. Token expires after 7 days
7. User must login again

### Password Security

```typescript
// Hashing Process
plainPassword → bcrypt.hash(12 rounds) → hashedPassword
                                         ↓
                                    Store in DB

// Verification Process
loginPassword + storedHash → bcrypt.compare → true/false
```

**Security Features:**
- 12 salt rounds (configurable)
- Passwords never logged
- Passwords never returned in responses
- Current password required for changes

### Rate Limiting

```
General API: 100 requests / 15 minutes
Auth Endpoints: 5 requests / 15 minutes
Password Changes: 3 requests / 1 hour
```

**Protection Against:**
- Brute force attacks
- Credential stuffing
- DoS attacks
- Resource exhaustion

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email       │
│ password    │
│ firstName   │
│ lastName    │
│ phoneNumber │
│ dateOfBirth │
│ address     │
│ role        │
│ isActive    │
│ lastLogin   │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐
│   Account   │
├─────────────┤
│ id (PK)     │
│ userId (FK) │
│ accountNum  │
│ accountType │
│ balance     │
│ currency    │
│ isActive    │
└──────┬──────┘
       │
       │ 1:N
       │
   ┌───┴───┬───────────────┐
   │       │               │
┌──▼───┐ ┌─▼───────┐ ┌────▼─────┐
│ Card │ │Transfer │ │Transaction│
└──────┘ └─────────┘ └──────────┘
```

### Key Relationships

**User → Accounts** (One-to-Many)
- One user has multiple accounts
- Each account belongs to one user
- Cascade delete

**Account → Transactions** (One-to-Many)
- One account has many transactions
- Each transaction belongs to one account
- Cascade delete

**Account → Cards** (One-to-Many)
- One account has multiple cards
- Each card belongs to one account
- Cascade delete

**Account → Transfers** (Many-to-Many)
- Accounts can transfer to/from other accounts
- Track sender and receiver

### Indexes

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);

-- Account indexes
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);

-- Transaction indexes
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_category ON transactions(category);
```

**Purpose:**
- Fast user lookup by email (login)
- Fast account lookup by user (list accounts)
- Fast transaction queries (history, filtering)

---

## Middleware Stack

### Execution Order

```
Request
  ↓
1. helmet()           → Security headers
  ↓
2. requestLogger      → Log request start
  ↓
3. cors()             → Check origin
  ↓
4. generalLimiter     → Check rate limit
  ↓
5. express.json()     → Parse JSON body
  ↓
6. express.urlencoded → Parse form data
  ↓
7. Route matching     → Find route
  ↓
8. authenticate       → Verify JWT (if protected)
  ↓
9. validate           → Validate input (if used)
  ↓
10. Controller        → Handle request
  ↓
11. Service           → Business logic
  ↓
12. Database          → Query data
  ↓
Response
  ↓
requestLogger         → Log response
```

### Middleware Details

**1. Helmet** - Security Headers
```typescript
Adds:
- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- And 7 more...
```

**2. Morgan** - Request Logging
```typescript
Development: "POST /api/auth/login 401 102ms - anonymous"
Production:  "192.168.1.1 POST /api/auth/login 401 102 anonymous"
```

**3. CORS** - Cross-Origin
```typescript
Allows: http://localhost:3000
Blocks: Other origins
```

**4. Rate Limiter** - Abuse Prevention
```typescript
Tracks requests by IP
Blocks after limit exceeded
Returns 429 status
```

**5. Body Parser** - JSON Parsing
```typescript
Converts: JSON string → JavaScript object
Attaches to: req.body
```

**6. Authenticate** - JWT Verification
```typescript
Checks: Authorization header
Verifies: Token signature
Decodes: User info
Attaches to: req.user
```

**7. Validate** - Input Validation
```typescript
Validates: req.body, req.query, req.params
Uses: Zod schemas
Returns 400: If validation fails
```

**8. Error Handler** - Error Response
```typescript
Catches: All errors
Formats: Error response
Logs: Error details
Returns: JSON error
```

---

## Performance Considerations

### Database Optimization

**Indexes:**
- Indexed on frequently queried fields
- Composite indexes for complex queries

**Query Optimization:**
- Use `select` to fetch only needed fields
- Use `skip` and `take` for pagination
- Avoid N+1 queries

**Connection Pooling:**
- Prisma manages connection pool
- Reuses connections for efficiency

### Caching Strategy (Future)

```
Level 1: Application Cache (Redis)
- User sessions
- Frequently accessed data
- 5-minute TTL

Level 2: Database Query Cache
- Repeated queries
- Auto-invalidation

Level 3: CDN Cache (Production)
- Static assets
- API responses (if applicable)
```

### Scalability

**Horizontal Scaling:**
- Stateless design (no session storage)
- Load balancer distributes requests
- Multiple server instances

**Vertical Scaling:**
- More CPU/RAM per server
- Database optimization
- Connection pooling

---

## Deployment Architecture (Production)

```
               ┌─────────────┐
               │   Route 53  │ DNS
               └──────┬──────┘
                      │
               ┌──────▼──────┐
               │ CloudFront  │ CDN
               └──────┬──────┘
                      │
               ┌──────▼──────┐
               │     ALB     │ Load Balancer
               └──────┬──────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
  ┌─────▼────┐  ┌─────▼────┐  ┌─────▼────┐
  │  EC2-1   │  │  EC2-2   │  │  EC2-3   │
  │ (API)    │  │ (API)    │  │ (API)    │
  └─────┬────┘  └─────┬────┘  └─────┬────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
               ┌──────▼──────┐
               │     RDS     │ PostgreSQL
               │  (Primary)  │
               └──────┬──────┘
                      │
               ┌──────▼──────┐
               │     RDS     │ PostgreSQL
               │  (Replica)  │ Read-only
               └─────────────┘
```

---

## Future Enhancements

### Short Term
- [ ] Add Redis for session storage
- [ ] Implement refresh tokens
- [ ] Add email verification
- [ ] Add password reset flow

### Medium Term
- [ ] Add automated tests (Jest)
- [ ] Add API documentation (Swagger)
- [ ] Add monitoring (Datadog/New Relic)
- [ ] Add CI/CD pipeline

### Long Term
- [ ] Microservices architecture
- [ ] Event-driven architecture
- [ ] GraphQL API option
- [ ] WebSocket for real-time updates

---

## Best Practices Followed

### Code Quality
- ✅ TypeScript for type safety
- ✅ ESLint for code linting
- ✅ Prettier for formatting
- ✅ Meaningful variable names
- ✅ Extensive code comments

### Security
- ✅ Password hashing
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Input validation
- ✅ Security headers
- ✅ CORS protection
- ✅ SQL injection prevention

### Performance
- ✅ Database indexes
- ✅ Connection pooling
- ✅ Pagination
- ✅ Selective field queries
- ✅ Efficient middleware

### Maintainability
- ✅ Clear architecture
- ✅ Separation of concerns
- ✅ DRY principle
- ✅ SOLID principles
- ✅ Comprehensive documentation

---

## References

### External Documentation
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Internal Documentation
- [API Documentation](./API.md)
- [Testing Guide](./TESTING.md)
- [Deployment Guide](./DEPLOYMENT.md) (coming soon)

---

**Last Updated:** January 2025  
**Version:** 1.0.0
