// ACCOUNT SERVICE - The Brain for Account Operations
// This handles all banking account logic (viewing accounts, transactions)
// Think of it as: The teller who handles account information

import { prisma } from '../config/database'; // Database connection
import { NotFoundError, ForbiddenError } from '../utils/errors'; // Custom errors
import { GetAccountsQuery, GetTransactionsQuery } from '../types/account.types'; // Types

// ACCOUNT SERVICE CLASS
export class AccountService {
  
  // ============================================
  // GET ALL USER'S ACCOUNTS
  // Returns all bank accounts belonging to a user
  // ============================================
  async getUserAccounts(userId: string, query: GetAccountsQuery) {
    // STEP 1: Build the query filter
    const where: any = {
      userId, // Only accounts belonging to this user
    };

    // If type filter provided, add it to where clause
    if (query.type) {
      where.accountType = query.type;
    }

    // STEP 2: Get total count (for pagination info)
    // This tells us how many total accounts match the filter
    const total = await prisma.account.count({ where });

    // STEP 3: Get the actual accounts with pagination
    const accounts = await prisma.account.findMany({
      where,
      // Pagination: skip 'offset' items, take 'limit' items
      skip: query.offset,
      take: query.limit,
      // Sort by creation date (newest first)
      orderBy: { createdAt: 'desc' },
      // Include related data
      select: {
        id: true,
        accountNumber: true,
        accountType: true,
        balance: true,
        currency: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // STEP 4: Return accounts with pagination metadata
    return {
      accounts,
      pagination: {
        total, // Total number of accounts
        limit: query.limit, // Items per page
        offset: query.offset, // Current offset
        hasMore: query.offset + query.limit < total, // Are there more pages?
      },
    };
  }

  // ============================================
  // GET ACCOUNT BY ID
  // Returns a specific account with full details
  // ============================================
  async getAccountById(accountId: string, userId: string) {
    // STEP 1: Find the account
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        accountNumber: true,
        accountType: true,
        balance: true,
        currency: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        userId: true, // Need this to check ownership
      },
    });

    // STEP 2: Check if account exists
    if (!account) {
      throw new NotFoundError('Account not found');
    }

    // STEP 3: Check if user owns this account
    // IMPORTANT: Authorization check!
    // Users should only see their OWN accounts
    if (account.userId !== userId) {
      throw new ForbiddenError('You do not have access to this account');
      // Don't tell them the account exists - security!
    }

    // STEP 4: Remove userId from response (internal only)
    const { userId: _, ...accountData } = account;

    return accountData;
  }

  // ============================================
  // GET ACCOUNT TRANSACTIONS
  // Returns transaction history for an account
  // ============================================
  async getAccountTransactions(
    accountId: string,
    userId: string,
    query: GetTransactionsQuery
  ) {
    // STEP 1: First, verify user owns this account
    // This prevents users from seeing other people's transactions!
    await this.getAccountById(accountId, userId);
    // If getAccountById doesn't throw, user owns the account

    // STEP 2: Build query filter
    const where: any = {
      accountId, // Transactions for this account only
    };

    // Filter by transaction type if provided
    if (query.type) {
      where.type = query.type; // Field is 'type' in schema
    }

    // Filter by date range if provided
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = query.startDate; // Greater than or equal
      }
      if (query.endDate) {
        where.createdAt.lte = query.endDate; // Less than or equal
      }
    }

    // STEP 3: Get total count
    const total = await prisma.transaction.count({ where });

    // STEP 4: Get transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where,
      skip: query.offset,
      take: query.limit,
      // Sort by date (newest first)
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true, // Transaction type (DEPOSIT, WITHDRAWAL, etc.)
        category: true, // Category (GROCERIES, ENTERTAINMENT, etc.)
        amount: true,
        description: true,
        merchant: true, // Where transaction occurred
        balanceAfter: true, // Account balance after this transaction
        createdAt: true,
        // Don't include accountId - user already knows which account
      },
    });

    // STEP 5: Return with pagination metadata
    return {
      transactions,
      pagination: {
        total,
        limit: query.limit,
        offset: query.offset,
        hasMore: query.offset + query.limit < total,
      },
    };
  }

  // ============================================
  // GET ACCOUNT SUMMARY
  // Returns summary statistics for all user's accounts
  // ============================================
  async getAccountsSummary(userId: string) {
    // Get all user's accounts
    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
      select: {
        accountType: true,
        balance: true,
        currency: true,
      },
    });

    // Calculate totals by account type
    const summary = {
      totalBalance: 0,
      checking: 0,
      savings: 0,
      credit: 0,
      accountCount: accounts.length,
    };

    // Sum up balances
    accounts.forEach((account) => {
      const balance = account.balance.toNumber(); // Convert Prisma Decimal to number
      summary.totalBalance += balance;

      // Add to appropriate category
      if (account.accountType === 'CHECKING') {
        summary.checking += balance;
      } else if (account.accountType === 'SAVINGS') {
        summary.savings += balance;
      } else if (account.accountType === 'CREDIT') {
        summary.credit += balance;
      }
    });

    return summary;
  }
}

// Export singleton instance
export const accountService = new AccountService();

// ============================================
// HOW THIS SERVICE WORKS:
// ============================================
//
// AUTHORIZATION FLOW:
// 1. User sends request with JWT token
// 2. Middleware extracts userId from token
// 3. Service queries database filtered by userId
// 4. User can ONLY see/access their own accounts
//
// EXAMPLE: User A tries to access User B's account
// 1. GET /api/accounts/user-b-account-id
// 2. Service finds account belongs to User B
// 3. Service checks: account.userId !== requestingUserId
// 4. Throws ForbiddenError (403)
//
// PAGINATION EXAMPLE:
// Total accounts: 25
// Request: limit=10, offset=0  → Returns accounts 1-10, hasMore=true
// Request: limit=10, offset=10 → Returns accounts 11-20, hasMore=true
// Request: limit=10, offset=20 → Returns accounts 21-25, hasMore=false
//
// WHY CHECK OWNERSHIP?
// - Security: Users shouldn't access other people's accounts!
// - Privacy: Transaction history is sensitive
// - Compliance: Banks must protect customer data
//
// DATABASE OPTIMIZATION:
// - Use `select` to only fetch needed fields (faster queries)
// - Use `skip` and `take` for pagination (don't load all data)
// - Use indexes on userId for fast filtering
// - Use `orderBy` for consistent sorting
