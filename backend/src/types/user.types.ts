// USER TYPES & VALIDATION - Define what data is valid for user operations
// Think of this as a checklist: "What information can users update?"

import { z } from 'zod'; // Validation library

// ============================================
// UPDATE PROFILE SCHEMA
// What fields can users update about themselves?
// ============================================

export const updateProfileSchema = z.object({
  // First name - required, at least 1 character
  firstName: z.string().min(1, 'First name is required').optional(),
  
  // Last name - required, at least 1 character
  lastName: z.string().min(1, 'Last name is required').optional(),
  
  // Phone number - optional, but if provided must be valid format
  // Examples: +1234567890, (123) 456-7890, 123-456-7890
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .nullable(), // nullable = can be null
  
  // Date of birth - must be in the past
  // Format: YYYY-MM-DD (e.g., "1990-05-15")
  dateOfBirth: z.string()
    .refine((date) => {
      const parsed = new Date(date);
      return parsed < new Date(); // Must be in the past
    }, 'Date of birth must be in the past')
    .optional()
    .nullable(),
  
  // Address - free text, optional
  address: z.string()
    .max(500, 'Address too long')
    .optional()
    .nullable(),
});

// TypeScript type from the schema
// This gives us autocomplete in IDE!
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ============================================
// CHANGE PASSWORD SCHEMA
// What's needed to change password?
// ============================================

export const changePasswordSchema = z.object({
  // Current password - user must prove they know current password
  // Why? Security - someone shouldn't be able to change password if they just found an unlocked laptop
  currentPassword: z.string().min(1, 'Current password is required'),
  
  // New password - must meet strength requirements
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  // Confirm password - must match newPassword
  // Why? Prevents typos when setting new password
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], // Show error on confirmPassword field
});

// TypeScript type
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ============================================
// HOW VALIDATION WORKS:
// ============================================
//
// Example 1: Valid profile update
// Input: { "firstName": "John", "phoneNumber": "+1234567890" }
// Result: Pass validation, proceed
//
// Example 2: Invalid phone number
// Input: { "phoneNumber": "abc123" }
// Result: Fail validation
// Error: { "field": "phoneNumber", "message": "Invalid phone number format" }
//
// Example 3: Passwords don't match
// Input: { 
//   "currentPassword": "old123", 
//   "newPassword": "New123!@", 
//   "confirmPassword": "New456!@" 
// }
// Result: Fail validation
// Error: { "field": "confirmPassword", "message": "Passwords do not match" }
//
// Example 4: Weak password
// Input: { "newPassword": "weak" }
// Result: Fail validation
// Error: [
//   { "field": "newPassword", "message": "Password must be at least 8 characters" },
//   { "field": "newPassword", "message": "Password must contain uppercase letter" },
//   { "field": "newPassword", "message": "Password must contain number" },
//   { "field": "newPassword", "message": "Password must contain special character" }
// ]
