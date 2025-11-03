// EXPRESS APP - The Restaurant Setup
// This file sets up the Express web server
// Think of it as setting up the restaurant before opening

import express from 'express'; // Express web framework
import cors from 'cors'; // Allows frontend to talk to backend
import helmet from 'helmet'; // Security headers
import { env } from './config/env'; // Environment variables
import authRoutes from './routes/auth.routes'; // Auth endpoints
import userRoutes from './routes/user.routes'; // User profile endpoints
import accountRoutes from './routes/account.routes'; // Account endpoints
import cardRoutes from './routes/card.routes'; // Card endpoints
import transactionRoutes from './routes/transaction.routes'; // Transaction endpoints
import { errorHandler } from './middleware/error.middleware'; // Error catcher
import { generalLimiter } from './middleware/rateLimiter.middleware'; // Rate limiting
import { requestLogger } from './middleware/logger.middleware'; // Request logging

// Create Express application
const app = express();

// ============================================
// MIDDLEWARE - Code that runs for EVERY request
// Order matters! Middleware runs top to bottom
// ============================================

// 1. Security Headers (Helmet) - Protect against common vulnerabilities
// Sets various HTTP headers to improve security
// - X-Content-Type-Options: Prevents MIME sniffing
// - X-Frame-Options: Prevents clickjacking
// - X-XSS-Protection: Enables XSS filter
// - And many more...
app.use(helmet());

// 2. Request Logger - Log all requests
// Logs: method, URL, status code, response time, user ID
// Example: GET /api/accounts 200 45ms - abc-123-user-id
app.use(requestLogger);

// 3. CORS Middleware - Allow requests from frontend
// Without this, browsers block requests from http://localhost:3000 to http://localhost:5000
// This is a security feature called "Same-Origin Policy"
app.use(cors({ 
  origin: env.corsOrigin, // Only allow requests from this URL (localhost:3000)
  credentials: true, // Allow cookies/auth headers
}));
// In production, set this to your actual frontend URL (e.g., https://mybank.com)

// 4. Rate Limiter - Prevent API abuse
// Limits: 100 requests per 15 minutes per IP
// Prevents: DoS attacks, brute force, resource exhaustion
app.use(generalLimiter);

// 5. JSON Parser - Convert request body to JavaScript object
// When client sends: { "email": "test@example.com" }
// Express converts it to: req.body = { email: "test@example.com" }
app.use(express.json());

// 6. URL Encoded Parser - Handle form data
// When client sends form data, this parses it
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES - Define what URLs your API responds to
// ============================================

// Health Check Endpoint - Check if server is running
// GET /health
// Returns: { "status": "ok", "timestamp": "2025-10-28T..." }
// Useful for monitoring and deployment checks
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Auth Routes - All authentication endpoints
// This mounts the auth router at /api/auth
// So all routes in auth.routes.ts get prefixed with /api/auth
app.use('/api/auth', authRoutes);
// /login becomes /api/auth/login
// /register becomes /api/auth/register
// /me becomes /api/auth/me

// User Routes - All user profile endpoints
// This mounts the user router at /api/user
// So all routes in user.routes.ts get prefixed with /api/user
app.use('/api/user', userRoutes);
// /profile becomes /api/user/profile
// /password becomes /api/user/password

// Account Routes - All account and transaction endpoints
// This mounts the account router at /api/accounts
// So all routes in account.routes.ts get prefixed with /api/accounts
app.use('/api/accounts', accountRoutes);
// / becomes /api/accounts (list all)
// /summary becomes /api/accounts/summary
// /:id becomes /api/accounts/:id
// /:id/transactions becomes /api/accounts/:id/transactions

// Card Routes - All card endpoints
// This mounts the card router at /api
// Routes are defined as /cards in card.routes.ts
app.use('/api', cardRoutes);
// /cards becomes /api/cards (list all user cards)
// /cards/:id becomes /api/cards/:id (get specific card)
// /accounts/:accountId/cards becomes /api/accounts/:accountId/cards (get account cards)

// Transaction Routes - All transaction endpoints (deposit, withdraw)
// This mounts the transaction router at /api/transactions
app.use('/api/transactions', transactionRoutes);
// /deposit becomes /api/transactions/deposit
// /withdraw becomes /api/transactions/withdraw

// ============================================
// ERROR HANDLER - Must be LAST!
// ============================================

// Error Handler Middleware - Catches all errors
// This MUST be after all routes
// Any error thrown in routes/controllers will be caught here
app.use(errorHandler);

// Export the app so server.ts can start it
export default app;

// HOW THE REQUEST FLOW WORKS:
//
// 1. Request arrives: POST /api/auth/login
// 2. CORS middleware runs (allows request)
// 3. JSON parser runs (parses body)
// 4. Express matches route: /api/auth/login
// 5. Auth routes handle it
// 6. If error occurs → errorHandler catches it
// 7. Response sent back to client
//
// MIDDLEWARE ORDER:
// ┌─────────────────┐
// │   Request In    │
// └────────┬────────┘
//          │
//          ↓
// ┌─────────────────┐
// │  CORS Middleware│  ← Allow frontend
// └────────┬────────┘
//          │
//          ↓
// ┌─────────────────┐
// │  JSON Parser    │  ← Parse body
// └────────┬────────┘
//          │
//          ↓
// ┌─────────────────┐
// │  Routes         │  ← Handle request
// └────────┬────────┘
//          │
//          ↓
// ┌─────────────────┐
// │  Error Handler  │  ← Catch errors
// └────────┬────────┘
//          │
//          ↓
// ┌─────────────────┐
// │  Response Out   │
// └─────────────────┘ 
