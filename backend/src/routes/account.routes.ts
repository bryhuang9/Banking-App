// ACCOUNT ROUTES - The Map for Account Endpoints
// Defines which URLs handle account and transaction operations
// Think of it as: The account section of the menu

import { Router } from 'express'; // Express router
import { accountController } from '../controllers/account.controller'; // The controller
import { authenticate } from '../middleware/auth.middleware'; // The bouncer

// Create router instance
const router = Router();

// ============================================
// ALL ACCOUNT ROUTES ARE PROTECTED
// Must be logged in to access any of these
// ============================================

// GET /api/accounts/summary - Get account summary (MUST BE FIRST!)
// Why first? Because '/summary' would match '/:id' if it came after
// Returns total balance, breakdown by type, account count
router.get('/summary', authenticate, accountController.getAccountsSummary.bind(accountController));

// GET /api/accounts - Get all user's accounts
// Optional query params: ?type=SAVINGS&limit=10&offset=0
// Returns list of accounts with pagination
router.get('/', authenticate, accountController.getAccounts.bind(accountController));

// GET /api/accounts/:id - Get specific account
// Example: GET /api/accounts/abc-123-def
// Returns single account details
router.get('/:id', authenticate, accountController.getAccountById.bind(accountController));

// GET /api/accounts/:id/transactions - Get account transaction history
// Example: GET /api/accounts/abc-123/transactions?type=DEPOSIT&limit=20
// Returns list of transactions with pagination
router.get(
  '/:id/transactions',
  authenticate,
  accountController.getAccountTransactions.bind(accountController)
);

// Export the router
export default router;

// ============================================
// ROUTE ORDER MATTERS!
// ============================================
//
// CORRECT ORDER (what we have):
// 1. /summary      → Matches exactly "summary"
// 2. /             → Matches root
// 3. /:id          → Matches any ID
// 4. /:id/transactions → Matches ID + transactions
//
// WRONG ORDER (what NOT to do):
// 1. /:id          → Would match "summary" as an ID! ❌
// 2. /summary      → Never reached! ❌
//
// RULE: Specific routes BEFORE dynamic routes
//
// ============================================
// URL EXAMPLES:
// ============================================
//
// GET /api/accounts
// → Lists all user's accounts
//
// GET /api/accounts?type=CHECKING
// → Lists only checking accounts
//
// GET /api/accounts?limit=5&offset=10
// → Gets accounts 11-15 (pagination)
//
// GET /api/accounts/summary
// → Gets account summary (total balance, etc.)
//
// GET /api/accounts/abc-123-def
// → Gets account with id "abc-123-def"
//
// GET /api/accounts/abc-123/transactions
// → Gets all transactions for account "abc-123"
//
// GET /api/accounts/abc-123/transactions?type=DEPOSIT
// → Gets only deposit transactions
//
// GET /api/accounts/abc-123/transactions?startDate=2025-01-01&endDate=2025-01-31
// → Gets transactions in January 2025
//
// ============================================
// AUTHORIZATION:
// ============================================
//
// All routes check:
// 1. Is user logged in? (authenticate middleware)
// 2. Does user own this account? (service layer)
//
// If user tries to access another user's account:
// → 403 Forbidden error
//
// If user not logged in:
// → 401 Unauthorized error
