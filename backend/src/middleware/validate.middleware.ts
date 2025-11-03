// VALIDATION MIDDLEWARE - Validates Request Data
// This creates reusable validation middleware from Zod schemas
// Think of it as: Quality control checking before processing

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// ============================================
// VALIDATION MIDDLEWARE FACTORY
// Creates middleware that validates request data
// ============================================

export const validate = (schema: ZodSchema) => {
  // Return a middleware function
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request data against schema
      // This checks: req.body, req.query, and req.params
      await schema.parseAsync({
        body: req.body,       // POST/PUT data
        query: req.query,     // URL query params (?key=value)
        params: req.params,   // URL path params (/:id)
      });

      // If validation passes, continue to next middleware/controller
      return next();
    } catch (error) {
      // If validation fails, send error response
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues.map((e) => ({
            field: e.path.join('.'),  // Which field failed?
            message: e.message,        // What's wrong?
          })),
        });
      }
      // If it's not a Zod error, pass to error handler
      return next(error);
    }
  };
};

// ============================================
// HOW TO USE THIS MIDDLEWARE:
// ============================================
//
// BEFORE (manual validation in controller):
// ```typescript
// async createUser(req, res, next) {
//   try {
//     const input = registerSchema.parse(req.body);
//     const user = await userService.create(input);
//     res.json(user);
//   } catch (error) {
//     next(error);
//   }
// }
// ```
//
// AFTER (validation middleware):
// ```typescript
// router.post(
//   '/register',
//   validate(registerSchema),  // ← Validation happens here
//   authController.register    // ← Controller just uses data
// );
// 
// async register(req, res, next) {
//   // Data is already validated!
//   const user = await userService.create(req.body);
//   res.json(user);
// }
// ```
//
// BENEFITS:
// 1. **DRY (Don't Repeat Yourself)**
//    - Validation logic in one place
//    - Reuse across routes
//
// 2. **Cleaner Controllers**
//    - Controllers don't need try-catch for validation
//    - Focus on business logic
//
// 3. **Consistent Error Format**
//    - All validation errors look the same
//    - Easier for frontend to handle
//
// 4. **Type Safety**
//    - TypeScript knows data is validated
//    - Autocomplete works better
//
// EXAMPLE USAGE:
//
// ```typescript
// import { z } from 'zod';
// import { validate } from '../middleware/validate.middleware';
//
// // Define schema
// const createPostSchema = z.object({
//   body: z.object({
//     title: z.string().min(1),
//     content: z.string().min(10),
//   }),
//   params: z.object({
//     userId: z.string().uuid(),
//   }),
// });
//
// // Use in route
// router.post(
//   '/users/:userId/posts',
//   authenticate,
//   validate(createPostSchema),  // ← Validates body AND params
//   postController.create
// );
// ```
//
// ERROR RESPONSE EXAMPLE:
//
// Request: POST /api/users with invalid data
// ```json
// {
//   "email": "not-an-email",
//   "password": "123"
// }
// ```
//
// Response: 400 Bad Request
// ```json
// {
//   "success": false,
//   "message": "Validation error",
//   "errors": [
//     {
//       "field": "body.email",
//       "message": "Invalid email address"
//     },
//     {
//       "field": "body.password",
//       "message": "Password must be at least 8 characters"
//     }
//   ]
// }
// ```
//
// ADVANCED: Partial Validation
//
// For PATCH requests (update some fields), use .partial():
// ```typescript
// const updateUserSchema = z.object({
//   body: z.object({
//     email: z.string().email(),
//     name: z.string(),
//   }).partial(), // All fields optional
// });
// ```
//
// ADVANCED: Transform Data
//
// Schemas can transform data:
// ```typescript
// const schema = z.object({
//   body: z.object({
//     age: z.string().transform((val) => parseInt(val, 10)),
//     // "25" → 25
//   }),
// });
// ```
//
// BEST PRACTICES:
//
// 1. **Validate early**
//    - Validate before doing database queries
//    - Saves resources if data is invalid
//
// 2. **Specific error messages**
//    - "Email is required" 
//    - "Invalid input" 
//
// 3. **Don't trust client data**
//    - Always validate on server
//    - Even if client validates too
//
// 4. **Sanitize input**
//    - Trim whitespace
//    - Lowercase emails
//    - Remove dangerous characters
