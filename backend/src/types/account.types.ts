// ACCOUNT TYPES - Define what data is valid for account operations
// Think of this as: Rules for how we work with bank accounts

import { z } from 'zod'; // Validation library

// ============================================
// QUERY PARAMETERS VALIDATION
// For filtering and pagination
// ============================================

// GET /api/accounts?type=CHECKING&limit=10
export const getAccountsQuerySchema = z.object({
  // Filter by account type (optional)
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT']).optional(),
  
  // Pagination - how many results per page
  // z.coerce.number() automatically converts string to number
  limit: z.coerce.number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(10), // Default to 10 if not provided
  
  // Pagination - which page (page 1, page 2, etc.)
  offset: z.coerce.number()
    .min(0, 'Offset must be non-negative')
    .default(0), // Default to 0 if not provided
});

export type GetAccountsQuery = z.infer<typeof getAccountsQuerySchema>;

// ============================================
// TRANSACTION QUERY PARAMETERS
// For filtering transaction history
// ============================================

// GET /api/accounts/:id/transactions?type=DEBIT&limit=20
export const getTransactionsQuerySchema = z.object({
  // Filter by transaction type (matches Prisma TransactionType enum)
  type: z.enum(['DEBIT', 'CREDIT']).optional(),
  
  // Filter by date range - start date
  startDate: z.coerce.date().optional(),
  
  // Filter by date range - end date
  endDate: z.coerce.date().optional(),
  
  // Pagination
  limit: z.coerce.number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(20), // Default to 20 transactions
  
  offset: z.coerce.number()
    .min(0, 'Offset must be non-negative')
    .default(0),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>;

// ============================================
// EXAMPLES OF HOW THIS WORKS:
// ============================================
//
// Example 1: Get all accounts
// GET /api/accounts
// Query params: {} (empty, uses defaults)
// Result: First 10 accounts of any type
//
// Example 2: Get savings accounts only
// GET /api/accounts?type=SAVINGS
// Query params: { type: "SAVINGS" }
// Result: First 10 savings accounts
//
// Example 3: Pagination
// GET /api/accounts?limit=5&offset=10
// Query params: { limit: 5, offset: 10 }
// Result: Accounts 11-15 (skip first 10, get next 5)
//
// Example 4: Filter transactions by type and date
// GET /api/accounts/abc123/transactions?type=CREDIT&startDate=2025-01-01
// Query params: { 
//   type: "CREDIT",  // DEBIT or CREDIT
//   startDate: Date("2025-01-01"),
//   limit: 20,
//   offset: 0
// }
// Result: First 20 credit transactions since Jan 1, 2025
//
// WHY PAGINATION?
// - Prevents loading ALL data at once (could be thousands of transactions!)
// - Better performance (faster queries)
// - Better UX (load more as user scrolls)
//
// PAGINATION MATH:
// Page 1: offset=0, limit=10  → Items 1-10
// Page 2: offset=10, limit=10 → Items 11-20
// Page 3: offset=20, limit=10 → Items 21-30
//
// Formula: offset = (page - 1) * limit
