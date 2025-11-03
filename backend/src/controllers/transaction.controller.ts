// Transaction controller: transaction operations

import { Request, Response, NextFunction } from 'express';
import { transactionService } from '../services/transaction.service';

export class TransactionController {
  async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const { accountId, amount, description } = req.body;

      const result = await transactionService.deposit(
        userId,
        accountId,
        amount,
        description
      );

      res.status(200).json({
        success: true,
        message: 'Deposit successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async withdraw(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const { accountId, amount, description } = req.body;

      const result = await transactionService.withdraw(
        userId,
        accountId,
        amount,
        description
      );

      res.status(200).json({
        success: true,
        message: 'Withdrawal successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const transactionController = new TransactionController();
