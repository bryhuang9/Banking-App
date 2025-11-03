// AUTH SERVICE - The Brain of Authentication
// This file contains all the LOGIN and REGISTER logic
// Think of it as the chef in a restaurant - it does the actual work

import bcrypt from 'bcrypt'; // For password encryption (one-way hashing)
import { prisma } from '../config/database'; // Our database connection
import { env } from '../config/env'; // Environment variables (secrets)
import { generateToken } from '../config/jwt'; // Creates JWT tokens
import { ConflictError, UnauthorizedError } from '../utils/errors'; // Custom error classes
import { RegisterInput, LoginInput } from '../types/auth.types'; // TypeScript types

// This is a CLASS - like a blueprint for creating an auth service
export class AuthService {
  
  // REGISTER FUNCTION - Creates a new user account
  // Input: email, password, firstName, lastName, etc.
  // Output: user info + JWT token
  async register(input: RegisterInput) {
    
    // STEP 1: Check if email is already used
    // Why? We can't have two users with the same email
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }, // Search by email
    });

    // If email exists, throw an error (409 = Conflict)
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // STEP 2: Hash (encrypt) the password
    // Why? NEVER store passwords as plain text!
    // "Demo123!" becomes "$2b$10$xyz..." (impossible to reverse)
    const hashedPassword = await bcrypt.hash(input.password, env.bcryptRounds);
    // env.bcryptRounds = 10 (how many times to encrypt)

    // STEP 3: Create the user in database
    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword, // Store HASHED password, not plain text!
        firstName: input.firstName,
        lastName: input.lastName,
        phoneNumber: input.phoneNumber,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        address: input.address,
      },
      // SELECT - Only return these fields (don't return password!)
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    // STEP 4: Generate JWT token (like a movie ticket)
    // This token proves they're logged in
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // STEP 5: Return user info and token
    return { user, token };
  }

  // LOGIN FUNCTION - Verifies email/password and gives token
  // Input: email, password
  // Output: user info + JWT token
  async login(input: LoginInput) {
    
    // STEP 1: Find user by email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    // If user doesn't exist, throw error (401 = Unauthorized)
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
      // NOTE: We say "Invalid email OR password" (not "email not found")
      // Why? Security - don't tell attackers which part is wrong
    }

    // STEP 2: Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedError('Account has been deactivated');
    }

    // STEP 3: Compare passwords
    // bcrypt.compare() checks if password matches the hashed version
    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    // If password doesn't match, throw error
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // STEP 4: Update last login timestamp
    // This helps us track when users last logged in
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }, // Set to current time
    });

    // STEP 5: Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // STEP 6: Remove password from response
    // We don't want to send the hashed password back to the client!
    const { password: _, ...userWithoutPassword } = user;
    // This creates a new object WITHOUT the password field

    // STEP 7: Return user info and token
    return { user: userWithoutPassword, token };
  }

  // VERIFY USER FUNCTION - Checks if user exists and is active
  // Used by the /api/auth/me endpoint
  async verifyUser(userId: string) {
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

    // If user not found or inactive, throw error
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    return user;
  }
}

// Export a SINGLE INSTANCE of AuthService
// This is called the "Singleton Pattern"
// Why? We only need one auth service for the entire app
export const authService = new AuthService();
