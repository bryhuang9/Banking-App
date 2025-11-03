// ERROR MIDDLEWARE - The Safety Net
// This file catches ALL errors and sends nice responses to the client
// Think of it as customer service - turns technical errors into friendly messages

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod'; // Validation error type
import { AppError } from '../utils/errors'; // Our custom error classes
import { env } from '../config/env'; // To check if we're in development mode

// ERROR HANDLER - Catches all errors from routes/controllers
// This MUST be the LAST middleware in your Express app
// Flow: Error thrown → error Handler → Response sent to client
export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log the error to console (helps with debugging)
  console.error('Error:', error);

  // CASE 1: Zod Validation Error
  // Example: User sends { email: "invalid" } instead of valid email
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.issues.map((e) => ({
        field: e.path.join('.'), // Which field failed? (e.g., "email")
        message: e.message,       // What's wrong? (e.g., "Invalid email address")
      })),
    });
  }

  // CASE 2: Our Custom Application Errors
  // Examples: UnauthorizedError, NotFoundError, ConflictError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      // In development, include stack trace for debugging
      ...(env.isDevelopment && { stack: error.stack }),
    });
  }

  // CASE 3: Unknown/Unexpected Errors
  // Something went wrong that we didn't anticipate
  return res.status(500).json({
    success: false,
    // In production, hide the actual error message (security)
    // In development, show it (helps debugging)
    message: env.isDevelopment ? error.message : 'Internal Server Error',
    ...(env.isDevelopment && { stack: error.stack }),
  });
}

// WHAT THIS MIDDLEWARE DOES:
//
// Without error middleware:
// - Error thrown → Server crashes or shows ugly error
// - Client sees: "Cannot GET /api/whatever" or browser error
//
// With error middleware:
// - Error thrown → errorHandler formats it nicely
// - Client sees: { "success": false, "message": "User not found" }
//
// EXAMPLES:
//
// Validation error:
// {
//   "success": false,
//   "message": "Validation error",
//   "errors": [
//     { "field": "email", "message": "Invalid email address" },
//     { "field": "password", "message": "Password too short" }
//   ]
// }
//
// Auth error:
// {
//   "success": false,
//   "message": "Invalid or expired token"
// }
//
// Unexpected error (development):
// {
//   "success": false,
//   "message": "Cannot read property 'id' of undefined",
//   "stack": "Error: Cannot read property...\n  at AuthService.login..."
// }
//
// Unexpected error (production):
// {
//   "success": false,
//   "message": "Internal Server Error"
// }
