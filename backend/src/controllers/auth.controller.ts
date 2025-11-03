// AUTH CONTROLLER - The Waiter of the Restaurant
// This file handles HTTP requests and responses
// Think of it as the waiter - takes orders, serves food, but doesn't cook

import { Request, Response, NextFunction } from 'express'; // Express types
import { authService } from '../services/auth.service'; // The chef (does the work)
import { registerSchema, loginSchema } from '../types/auth.types'; // Validation rules

// This is a CLASS - blueprint for the auth controller
export class AuthController {
  
  // REGISTER ENDPOINT - POST /api/auth/register
  // What it does: Creates a new user account
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // STEP 1: Validate the incoming data
      // registerSchema checks if email is valid, password is strong, etc.
      const input = registerSchema.parse(req.body);
      // If validation fails, .parse() throws an error automatically

      // STEP 2: Call the service to do the actual work
      // This is like the waiter telling the chef what to cook
      const result = await authService.register(input);

      // STEP 3: Send success response
      // 201 = Created (new resource was created)
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result, // Contains: { user, token }
      });
    } catch (error) {
      // If anything goes wrong, pass error to error handler
      // The error middleware will format it nicely
      next(error);
    }
  }

  // LOGIN ENDPOINT - POST /api/auth/login
  // What it does: Verifies credentials and returns token
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // STEP 1: Validate login data
      const input = loginSchema.parse(req.body);

      // STEP 2: Call service to verify credentials
      const result = await authService.login(input);

      // STEP 3: Send success response
      // 200 = OK (request succeeded)
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result, // Contains: { user, token }
      });
    } catch (error) {
      next(error);
    }
  }

  // LOGOUT ENDPOINT - POST /api/auth/logout
  // What it does: Logs user out (client-side token removal)
  async logout(_req: Request, res: Response, next: NextFunction) {
    // Note: _req means "req parameter exists but we don't use it"
    try {
      // In JWT authentication, logout is handled CLIENT-SIDE
      // Why? Because JWTs are stateless (server doesn't track them)
      // The client just deletes the token from localStorage
      
      // If you want server-side logout, you'd need to:
      // 1. Maintain a token blacklist in database/Redis
      // 2. Check blacklist on every request
      // But that defeats the purpose of stateless JWT
      
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  // GET ME ENDPOINT - GET /api/auth/me
  // What it does: Returns current user's profile
  // NOTE: This is a PROTECTED route (requires valid token)
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      // STEP 1: Get user ID from request
      // The auth middleware already verified the token and attached user info
      const userId = (req as any).user.userId;
      // Note: (req as any) is a TypeScript workaround
      // In a real app, you'd extend the Request type properly
      
      // STEP 2: Get fresh user data from database
      const user = await authService.verifyUser(userId);

      // STEP 3: Send user data
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export a single instance of AuthController
// Singleton pattern - only one controller needed
export const authController = new AuthController();
