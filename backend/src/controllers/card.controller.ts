// CARD CONTROLLER - Handles HTTP requests for card operations
// Routes requests to card service and formats responses

import { Request, Response, NextFunction } from 'express';
import * as cardService from '../services/card.service';
import { z } from 'zod';
import { BadRequestError } from '../utils/errors';

// Validation schemas
const createCardSchema = z.object({
  accountId: z.string().uuid(),
  cardType: z.enum(['DEBIT', 'CREDIT']),
  cardholderName: z.string().min(2),
  expiryDate: z.string(), // Format: YYYY-MM-DD
  creditLimit: z.number().optional(),
});

const updateCardStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']),
});

// GET /api/cards - Get all user's cards
export async function getUserCards(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    
    const cards = await cardService.getUserCards(userId);
    
    res.status(200).json({ success: true, message: 'Cards retrieved successfully', data: cards });
  } catch (error) {
    next(error);
  }
}

// GET /api/accounts/:accountId/cards - Get cards for specific account
export async function getAccountCards(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const { accountId } = req.params;
    
    const cards = await cardService.getAccountCards(accountId, userId);
    
    res.status(200).json({ success: true, message: 'Account cards retrieved successfully', data: cards });
  } catch (error) {
    next(error);
  }
}

// GET /api/cards/:cardId - Get single card
export async function getCard(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const { cardId } = req.params;
    
    const card = await cardService.getCard(cardId, userId);
    
    res.status(200).json({ success: true, message: 'Card retrieved successfully', data: card });
  } catch (error) {
    next(error);
  }
}

// POST /api/cards - Create new card
export async function createCard(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    
    // Validate request body
    const validation = createCardSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError(validation.error.issues[0].message);
    }
    
    const { accountId, cardType, cardholderName, expiryDate, creditLimit } = validation.data;
    
    const card = await cardService.createCard({
      accountId,
      cardType: cardType as any,
      cardholderName,
      expiryDate: new Date(expiryDate),
      creditLimit,
      userId,
    });
    
    res.status(201).json({ success: true, message: 'Card created successfully', data: card });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/cards/:cardId/status - Update card status
export async function updateCardStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const { cardId } = req.params;
    
    // Validate request body
    const validation = updateCardStatusSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError(validation.error.issues[0].message);
    }
    
    const { status } = validation.data;
    
    const card = await cardService.updateCardStatus(cardId, status as any, userId);
    
    res.status(200).json({ success: true, message: 'Card status updated successfully', data: card });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/cards/:cardId - Delete card
export async function deleteCard(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const { cardId } = req.params;
    
    const result = await cardService.deleteCard(cardId, userId);
    
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
}
