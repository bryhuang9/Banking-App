// Transaction routes

import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All transaction routes require authentication
router.use(authenticate);

// Deposit money into account
router.post('/deposit', transactionController.deposit.bind(transactionController));

// Withdraw money from account
router.post('/withdraw', transactionController.withdraw.bind(transactionController));

export default router;
