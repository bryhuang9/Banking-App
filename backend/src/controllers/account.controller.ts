// ACCOUNT CONTROLLER - The Waiter for Account Operations
// Handles HTTP requests for viewing accounts and transactions
// Think of it as: Taking account-related orders and serving results

import { Request, Response, NextFunction } from 'express'; // Express types
import { accountService } from '../services/account.service'; // The chef
import { getAccountsQuerySchema, getTransactionsQuerySchema } from '../types/account.types'; // Validation

// ACCOUNT CONTROLLER CLASS
export class AccountController {
  
  // ============================================
  // GET ALL ACCOUNTS - GET /api/accounts
  // Returns all accounts belonging to current user
  // ============================================
  async getAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      // STEP 1: Get user ID from authenticated request
      const userId = (req as any).user.userId;

      // STEP 2: Validate query parameters
      // This handles: ?type=CHECKING&limit=10&offset=0
      const query = getAccountsQuerySchema.parse(req.query);

      // STEP 3: Get accounts from service
      const result = await accountService.getUserAccounts(userId, query);

      // STEP 4: Send response
      res.status(200).json({
        success: true,
        data: result.accounts,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET ACCOUNT BY ID - GET /api/accounts/:id
  // Returns specific account details
  // ============================================
  async getAccountById(req: Request, res: Response, next: NextFunction) {
    try {
      // STEP 1: Get IDs
      const userId = (req as any).user.userId;
      const accountId = req.params.id; // From URL: /api/accounts/:id

      // STEP 2: Get account (service checks ownership)
      const account = await accountService.getAccountById(accountId, userId);

      // STEP 3: Send response
      res.status(200).json({
        success: true,
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET ACCOUNT TRANSACTIONS - GET /api/accounts/:id/transactions
  // Returns transaction history for an account
  // ============================================
  async getAccountTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      // STEP 1: Get IDs
      const userId = (req as any).user.userId;
      const accountId = req.params.id;

      // STEP 2: Validate query parameters
      // This handles: ?type=DEPOSIT&startDate=2025-01-01&limit=20
      const query = getTransactionsQuerySchema.parse(req.query);

      // STEP 3: Get transactions (service checks ownership)
      const result = await accountService.getAccountTransactions(
        accountId,
        userId,
        query
      );

      // STEP 4: Send response
      res.status(200).json({
        success: true,
        data: result.transactions,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET ACCOUNTS SUMMARY - GET /api/accounts/summary
  // Returns summary of all user's accounts
  // ============================================
  async getAccountsSummary(req: Request, res: Response, next: NextFunction) {
    try {
      // STEP 1: Get user ID
      const userId = (req as any).user.userId;

      // STEP 2: Get summary
      const summary = await accountService.getAccountsSummary(userId);

      // STEP 3: Send response
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const accountController = new AccountController();

// ============================================
// HOW THESE ENDPOINTS WORK:
// ============================================
//
// GET ALL ACCOUNTS:
// Request: GET /api/accounts?type=SAVINGS&limit=5
// Response: {
//   "success": true,
//   "data": [
//     {
//       "id": "abc123",
//       "accountNumber": "1234567890",
//       "accountType": "SAVINGS",
//       "balance": 5000.00,
//       "currency": "USD",
//       ...
//     }
//   ],
//   "pagination": {
//     "total": 12,
//     "limit": 5,
//     "offset": 0,
//     "hasMore": true
//   }
// }
//
// GET ACCOUNT BY ID:
// Request: GET /api/accounts/abc123
// Response: {
//   "success": true,
//   "data": {
//     "id": "abc123",
//     "accountNumber": "1234567890",
//     "balance": 5000.00,
//     ...
//   }
// }
//
// GET TRANSACTIONS:
// Request: GET /api/accounts/abc123/transactions?type=DEPOSIT&limit=10
// Response: {
//   "success": true,
//   "data": [
//     {
//       "id": "tx123",
//       "type": "DEPOSIT",
//       "amount": 100.00,
//       "description": "Paycheck",
//       "createdAt": "2025-01-15T10:30:00Z"
//     }
//   ],
//   "pagination": { ... }
// }
//
// GET SUMMARY:
// Request: GET /api/accounts/summary
// Response: {
//   "success": true,
//   "data": {
//     "totalBalance": 15000.00,
//     "checking": 5000.00,
//     "savings": 10000.00,
//     "credit": 0,
//     "accountCount": 3
//   }
// }
