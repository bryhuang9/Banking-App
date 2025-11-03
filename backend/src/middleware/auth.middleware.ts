// AUTH MIDDLEWARE - The Bouncer at the Club
// This file checks if users are logged in before letting them access protected routes
// Think of it as a bouncer checking IDs at the door

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt'; // Function to verify JWT tokens
import { UnauthorizedError } from '../utils/errors';

// AUTHENTICATE MIDDLEWARE - Checks if request has a valid JWT token
// This runs BEFORE the controller
// Flow: Request → authenticate() → Controller
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  // Note: _res means "res parameter exists but we don't use it"
  try {
    // STEP 1: Get the Authorization header
    // Example header: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers.authorization;

    // STEP 2: Check if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
      // This means user didn't send a token (not logged in)
    }

    // STEP 3: Extract the token
    // Remove "Bearer " prefix to get just the token
    // "Bearer xyz123" → "xyz123"
    const token = authHeader.substring(7); // Skip first 7 characters ("Bearer ")

    // STEP 4: Verify the token is valid
    // This checks:
    // 1. Token hasn't been tampered with (signature is valid)
    // 2. Token hasn't expired (still within 7 days)
    // 3. Token was signed with our secret key
    const payload = verifyToken(token);
    // payload = { userId: "abc123", email: "user@example.com", role: "USER" }

    // STEP 5: Attach user info to the request object
    // Now any subsequent middleware/controller can access req.user
    (req as any).user = payload;
    // Note: In production, you'd extend the Request type properly

    // STEP 6: Continue to next middleware/controller
    // next() = "All good, let them through"
    next();
    
  } catch (error) {
    // If token is invalid/expired, send to error handler
    // Common reasons for failure:
    // - Token expired (more than 7 days old)
    // - Token was tampered with
    // - Token was signed with wrong secret
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

// HOW TO USE THIS MIDDLEWARE:
//
// Unprotected route (anyone can access):
// router.post('/login', authController.login);
//
// Protected route (must be logged in):
// router.get('/profile', authenticate, userController.getProfile);
//                       ↑
//                 Middleware runs first!
//
// The authenticate middleware will:
// 1. Check if user sent a valid token
// 2. If YES → call userController.getProfile
// 3. If NO → return 401 Unauthorized error
