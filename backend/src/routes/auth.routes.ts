// AUTH ROUTES - The Map
// This file defines which URLs go to which controllers
// Think of it as a restaurant menu - it lists what's available

import { Router } from 'express'; // Express router for defining routes
import { authController } from '../controllers/auth.controller'; // The controller
import { authenticate } from '../middleware/auth.middleware'; // The bouncer
import { authLimiter } from '../middleware/rateLimiter.middleware'; // Strict rate limiting for auth

// Create a router instance
// A router is like a mini-app that handles a specific set of routes
const router = Router();

// ============================================
// PUBLIC ROUTES - No authentication required
// Anyone can access these (even if not logged in)
// ============================================

// POST /api/auth/register - Create new user account
// Example request:
// {
//   "email": "john@example.com",
//   "password": "Test123!",
//   "firstName": "John",
//   "lastName": "Doe"
// }
// Rate limited: 5 attempts per 15 minutes (prevents abuse)
router.post('/register', authLimiter, authController.register.bind(authController));
// .bind(authController) ensures "this" refers to authController inside the method

// POST /api/auth/login - Login and get JWT token
// Example request:
// {
//   "email": "john@example.com",
//   "password": "Test123!"
// }
// Rate limited: 5 attempts per 15 minutes (prevents brute force)
router.post('/login', authLimiter, authController.login.bind(authController));

// ============================================
// PROTECTED ROUTES - Authentication required
// Must send valid JWT token in Authorization header
// ============================================

// POST /api/auth/logout - Logout (invalidate token client-side)
// Must send: Authorization: Bearer <token>
router.post('/logout', authenticate, authController.logout.bind(authController));
//                     ↑
//              Middleware runs first!

// GET /api/auth/me - Get current user's profile
// Must send: Authorization: Bearer <token>
// Returns current user's info (who am I?)
router.get('/me', authenticate, authController.me.bind(authController));

// Export the router so app.ts can use it
export default router;

// HOW ROUTES WORK:
//
// 1. Client sends request: POST http://localhost:5000/api/auth/login
// 2. Express matches it to: router.post('/login', ...)
// 3. Express calls: authController.login()
// 4. Controller processes request
// 5. Controller sends response back to client
//
// For protected routes:
// 1. Client sends: GET http://localhost:5000/api/auth/me
//    with header: Authorization: Bearer xyz123
// 2. Express matches: router.get('/me', authenticate, ...)
// 3. First, authenticate() middleware runs (checks token)
// 4. If token valid, authController.me() runs
// 5. If token invalid, error sent to client (401 Unauthorized)
//
// The ORDER matters!
// app.use('/api/auth', authRoutes)
//                     ↓
// All routes in this file will be prefixed with /api/auth
// So '/login' becomes '/api/auth/login'
