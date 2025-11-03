// USER ROUTES - The Map for User Endpoints
// Defines which URLs handle user profile operations
// Think of it as: The user management section of the menu

import { Router } from 'express'; // Express router
import { userController } from '../controllers/user.controller'; // The controller
import { authenticate } from '../middleware/auth.middleware'; // The bouncer
import { passwordLimiter } from '../middleware/rateLimiter.middleware'; // Extra strict for passwords

// Create router instance
const router = Router();

// ============================================
// ALL USER ROUTES ARE PROTECTED
// Must be logged in (have valid JWT token) to access any of these
// ============================================

// GET /api/user/profile - Get current user's profile
// Returns complete user information (email, name, phone, address, etc.)
// Example: GET http://localhost:5000/api/user/profile
// Headers: Authorization: Bearer <your_token>
router.get('/profile', authenticate, userController.getProfile.bind(userController));
//                     ↑ Middleware checks token first

// PUT /api/user/profile - Update user profile
// Updates personal information (name, phone, address, date of birth)
// Example: PUT http://localhost:5000/api/user/profile
// Headers: Authorization: Bearer <your_token>
// Body: { "firstName": "Jane", "phoneNumber": "+1234567890" }
router.put('/profile', authenticate, userController.updateProfile.bind(userController));

// PUT /api/user/password - Change password
// Requires current password for verification
// Example: PUT http://localhost:5000/api/user/password
// Headers: Authorization: Bearer <your_token>
// Body: {
//   "currentPassword": "Old123!",
//   "newPassword": "New123!@",
//   "confirmPassword": "New123!@"
// }
// Rate limited: 3 attempts per hour (extra protection for password changes)
router.put('/password', authenticate, passwordLimiter, userController.changePassword.bind(userController));

// Export the router
export default router;

// ============================================
// HOW TO USE THESE ROUTES:
// ============================================
//
// STEP 1: Login to get token
// POST /api/auth/login
// Body: { "email": "user@demo.com", "password": "Demo123!" }
// Response: { ..., "token": "eyJhbGci..." }
//
// STEP 2: Use token in subsequent requests
// GET /api/user/profile
// Headers: Authorization: Bearer eyJhbGci...
//
// FLOW:
// 1. Client sends request with token
// 2. authenticate() middleware verifies token
// 3. If valid → continue to controller
// 4. If invalid → return 401 Unauthorized
// 5. Controller processes request
// 6. Response sent back to client
//
// WHY AUTHENTICATE ON ALL ROUTES?
// - Security: Only logged-in users can access their profile
// - Privacy: Users can only see/update their OWN profile
// - Token contains userId, so we know WHO is making the request
//
// URL STRUCTURE:
// /api/user/* → All user-related endpoints
// /api/auth/* → All authentication-related endpoints (from auth.routes.ts)
// /api/accounts/* → All account-related endpoints (Day 4)
//
// These routes will be mounted in app.ts:
// app.use('/api/user', userRoutes);
// So '/profile' becomes '/api/user/profile'
