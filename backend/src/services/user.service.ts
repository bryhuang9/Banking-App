// USER SERVICE - The Brain for User Operations
// This handles all user profile and password management logic
// Think of it as: The chef that prepares user-related dishes

import bcrypt from 'bcrypt'; // Password hashing
import { prisma } from '../config/database'; // Database connection
import { env } from '../config/env'; // Environment variables
import { NotFoundError, UnauthorizedError, BadRequestError } from '../utils/errors'; // Custom errors
import { UpdateProfileInput, ChangePasswordInput } from '../types/user.types'; // Validation types

// USER SERVICE CLASS
export class UserService {
  
  // ============================================
  // GET USER PROFILE
  // Fetches complete user information from database
  // ============================================
  async getProfile(userId: string) {
    // STEP 1: Find user in database by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // SELECT - Specify which fields to return
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        dateOfBirth: true,
        address: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        // password: false ← We DON'T return password! Security!
      },
    });

    // STEP 2: Check if user exists
    if (!user) {
      throw new NotFoundError('User not found');
      // This shouldn't happen if authentication worked correctly
      // But defensive programming = always check!
    }

    // STEP 3: Return user data
    return user;
  }

  // ============================================
  // UPDATE USER PROFILE
  // Updates user's personal information
  // ============================================
  async updateProfile(userId: string, input: UpdateProfileInput) {
    // STEP 1: Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // STEP 2: Check if user is active
    if (!existingUser.isActive) {
      throw new BadRequestError('Account is deactivated');
    }

    // STEP 3: Update user in database
    // Only updates fields that were provided in input
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        // If firstName provided, update it; otherwise keep existing value
        ...(input.firstName && { firstName: input.firstName }),
        ...(input.lastName && { lastName: input.lastName }),
        ...(input.phoneNumber !== undefined && { phoneNumber: input.phoneNumber }),
        ...(input.dateOfBirth && { dateOfBirth: new Date(input.dateOfBirth) }),
        ...(input.address !== undefined && { address: input.address }),
      },
      // Return updated user data (without password)
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        dateOfBirth: true,
        address: true,
        role: true,
        updatedAt: true,
      },
    });

    // STEP 4: Return updated user
    return updatedUser;
  }

  // ============================================
  // CHANGE PASSWORD
  // Allows user to change their password
  // ============================================
  async changePassword(userId: string, input: ChangePasswordInput) {
    // STEP 1: Get user from database (need current password hash)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // STEP 2: Verify current password is correct
    // Why? Security - prove you know the current password
    const isCurrentPasswordValid = await bcrypt.compare(
      input.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
      // Don't give more details - security best practice
    }

    // STEP 3: Check if new password is different from current
    // Why bother changing if it's the same?
    const isSamePassword = await bcrypt.compare(
      input.newPassword,
      user.password
    );

    if (isSamePassword) {
      throw new BadRequestError('New password must be different from current password');
    }

    // STEP 4: Hash the new password
    // NEVER store plain text passwords!
    const hashedPassword = await bcrypt.hash(input.newPassword, env.bcryptRounds);

    // STEP 5: Update password in database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // STEP 6: Return success (no sensitive data)
    return { message: 'Password changed successfully' };
  }

  // ============================================
  // GET USER BY ID (Helper method)
  // Used internally by other services
  // ============================================
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}

// Export singleton instance
export const userService = new UserService();

// ============================================
// HOW THIS SERVICE WORKS:
// ============================================
//
// FLOW FOR GET PROFILE:
// 1. Controller calls: userService.getProfile(userId)
// 2. Service queries database
// 3. Returns user data (without password!)
//
// FLOW FOR UPDATE PROFILE:
// 1. Controller validates input with Zod
// 2. Controller calls: userService.updateProfile(userId, input)
// 3. Service checks user exists and is active
// 4. Service updates only provided fields
// 5. Returns updated user data
//
// FLOW FOR CHANGE PASSWORD:
// 1. Controller validates input (newPassword === confirmPassword)
// 2. Controller calls: userService.changePassword(userId, input)
// 3. Service verifies current password is correct
// 4. Service checks new password is different
// 5. Service hashes new password
// 6. Service updates database
// 7. Returns success message
//
// SECURITY FEATURES:
// - Never return password field
// - Verify current password before allowing change
// - Hash passwords before storing
// - Require new password to be different
// - Check user is active before updates
// - Use descriptive error messages (but not too descriptive!)
//
// WHY SPREAD OPERATOR (...)  ?
// ...(input.firstName && { firstName: input.firstName })
//
// This means: "Only include firstName in update if it was provided"
// Example:
// Input: { firstName: "John" }
// Data: { firstName: "John" } ✅ Update firstName
//
// Input: {}
// Data: {} ✅ Don't update firstName (keep existing value)
