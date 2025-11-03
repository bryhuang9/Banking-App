// CARD ROUTES - Define HTTP routes for card operations
// All routes are protected (require authentication)

import { Router } from 'express';
import * as cardController from '../controllers/card.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// All card routes require authentication
router.use(authenticate);

// GET /api/cards - Get all user's cards
router.get('/cards', cardController.getUserCards);

// GET /api/cards/:cardId - Get specific card
router.get('/cards/:cardId', cardController.getCard);

// POST /api/cards - Create new card (rate limited)
router.post('/cards', authLimiter, cardController.createCard);

// PATCH /api/cards/:cardId/status - Update card status
router.patch('/cards/:cardId/status', cardController.updateCardStatus);

// DELETE /api/cards/:cardId - Delete card
router.delete('/cards/:cardId', cardController.deleteCard);

// GET /api/accounts/:accountId/cards - Get cards for specific account
router.get('/accounts/:accountId/cards', cardController.getAccountCards);

export default router;
