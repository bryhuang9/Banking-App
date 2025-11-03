// USER CONTROLLER - The Waiter for User Operations
// Handles HTTP requests for user profile management
// Think of it as: Taking orders and serving user-related requests

import { Request, Response, NextFunction } from 'express'; // Express types
import { userService } from '../services/user.service'; // The chef
import { updateProfileSchema, changePasswordSchema } from '../types/user.types'; // Validation

// USER CONTROLLER CLASS
export class UserController {
  
  // ============================================
  // GET PROFILE - GET /api/user/profile
  // Returns current user's complete profile
  // ============================================
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // STEP 1: Get user ID from authenticated request
      // The authenticate middleware already verified the token
      // and attached user info to the request
      const userId = (req as any).user.userId;
      // Note: In production, you'd extend the Request type properly

      // STEP 2: Call service to get profile data
      const profile = await userService.getProfile(userId);

      // STEP 3: Send success response
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      // Pass error to error handler middleware
      next(error);
    }
  }

  // ============================================
  // UPDATE PROFILE - PUT /api/user/profile
  // Updates user's personal information
  // ============================================
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // STEP 1: Get user ID
      const userId = (req as any).user.userId;

      // STEP 2: Validate input data
      // updateProfileSchema checks:
      // - firstName is valid (if provided)
      // - lastName is valid (if provided)
      // - phoneNumber format is correct (if provided)
      // - dateOfBirth is in the past (if provided)
      // - address is not too long (if provided)
      const input = updateProfileSchema.parse(req.body);

      // STEP 3: Call service to update profile
      const updatedProfile = await userService.updateProfile(userId, input);

      // STEP 4: Send success response
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // CHANGE PASSWORD - PUT /api/user/password
  // Allows user to change their password
  // ============================================
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      // STEP 1: Get user ID
      const userId = (req as any).user.userId;

      // STEP 2: Validate input data
      // changePasswordSchema checks:
      // - currentPassword is provided
      // - newPassword meets strength requirements
      // - confirmPassword matches newPassword
      const input = changePasswordSchema.parse(req.body);

      // STEP 3: Call service to change password
      const result = await userService.changePassword(userId, input);

      // STEP 4: Send success response
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const userController = new UserController();

// ============================================
// HOW THESE ENDPOINTS WORK:
// ============================================
//
// GET PROFILE:
// Request: GET /api/user/profile
// Headers: Authorization: Bearer <token>
// Response: {
//   "success": true,
//   "data": {
//     "id": "abc123",
//     "email": "user@example.com",
//     "firstName": "John",
//     "lastName": "Doe",
//     ...
//   }
// }
//
// UPDATE PROFILE:
// Request: PUT /api/user/profile
// Headers: Authorization: Bearer <token>
// Body: {
//   "firstName": "Jane",
//   "phoneNumber": "+1234567890"
// }
// Response: {
//   "success": true,
//   "message": "Profile updated successfully",
//   "data": { ...updated user data... }
// }
//
// CHANGE PASSWORD:
// Request: PUT /api/user/password
// Headers: Authorization: Bearer <token>
// Body: {
//   "currentPassword": "Old123!",
//   "newPassword": "New123!@",
//   "confirmPassword": "New123!@"
// }
// Response: {
//   "success": true,
//   "message": "Password changed successfully"
// }
//
// ERROR EXAMPLES:
//
// 1. Invalid phone number:
// Response: {
//   "success": false,
//   "message": "Validation error",
//   "errors": [{
//     "field": "phoneNumber",
//     "message": "Invalid phone number format"
//   }]
// }
//
// 2. Wrong current password:
// Response: {
//   "success": false,
//   "message": "Current password is incorrect"
// }
//
// 3. Passwords don't match:
// Response: {
//   "success": false,
//   "message": "Validation error",
//   "errors": [{
//     "field": "confirmPassword",
//     "message": "Passwords do not match"
//   }]
// }
