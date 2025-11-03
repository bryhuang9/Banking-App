// Transaction service: business logic for transaction operations

import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';

export class TransactionService {
  async deposit(userId: string, accountId: string, amount: number, description: string) {
    // Validate amount
    if (amount <= 0) {
      throw new BadRequestError('Amount must be greater than 0');
    }

    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    // Create deposit transaction and update balance
    const currentBalance = parseFloat(account.balance.toString());
    const newBalance = currentBalance + amount;
    
    const [transaction, updatedAccount] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          accountId,
          type: 'CREDIT', // CREDIT means money coming in (deposit)
          amount: amount.toString(),
          description: description || 'Deposit',
          balanceAfter: newBalance.toString(),
        },
      }),
      prisma.account.update({
        where: { id: accountId },
        data: {
          balance: newBalance.toString(),
        },
      }),
    ]);

    return { transaction, account: updatedAccount };
  }

  async withdraw(userId: string, accountId: string, amount: number, description: string) {
    // Validate amount
    if (amount <= 0) {
      throw new BadRequestError('Amount must be greater than 0');
    }

    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    // Check sufficient funds
    const currentBalance = parseFloat(account.balance.toString());
    if (currentBalance < amount) {
      throw new BadRequestError('Insufficient funds');
    }

    const newBalance = currentBalance - amount;

    // Create withdrawal transaction and update balance
    const [transaction, updatedAccount] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          accountId,
          type: 'DEBIT', // DEBIT means money going out (withdrawal)
          amount: amount.toString(),
          description: description || 'Withdrawal',
          balanceAfter: newBalance.toString(),
        },
      }),
      prisma.account.update({
        where: { id: accountId },
        data: {
          balance: newBalance.toString(),
        },
      }),
    ]);

    return { transaction, account: updatedAccount };
  }
}

export const transactionService = new TransactionService();
