// CARD SERVICE - Business logic for card operations
// Handles creating, reading, updating, and deleting cards

import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { CardType, CardStatus } from '@prisma/client';

// Get all cards for a user
export async function getUserCards(userId: string) {
  const cards = await prisma.card.findMany({
    where: {
      account: {
        userId: userId,
      },
    },
    include: {
      account: {
        select: {
          accountNumber: true,
          accountType: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return cards;
}

// Get cards for a specific account
export async function getAccountCards(accountId: string, userId: string) {
  // Verify account belongs to user
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId: userId,
    },
  });

  if (!account) {
    throw new NotFoundError('Account not found');
  }

  const cards = await prisma.card.findMany({
    where: {
      accountId: accountId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return cards;
}

// Get single card
export async function getCard(cardId: string, userId: string) {
  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      account: {
        userId: userId,
      },
    },
    include: {
      account: {
        select: {
          accountNumber: true,
          accountType: true,
          balance: true,
        },
      },
    },
  });

  if (!card) {
    throw new NotFoundError('Card not found');
  }

  return card;
}

// Create new card
export async function createCard(data: {
  accountId: string;
  cardType: CardType;
  cardholderName: string;
  expiryDate: Date;
  creditLimit?: number;
  userId: string;
}) {
  // Verify account belongs to user
  const account = await prisma.account.findFirst({
    where: {
      id: data.accountId,
      userId: data.userId,
    },
  });

  if (!account) {
    throw new NotFoundError('Account not found');
  }

  // Generate card number (16 digits)
  const cardNumber = generateCardNumber();

  // Generate CVV (3 digits)
  const cvv = generateCVV();

  // Create card
  const card = await prisma.card.create({
    data: {
      cardNumber,
      cardType: data.cardType,
      cardholderName: data.cardholderName,
      expiryDate: data.expiryDate,
      cvv,
      creditLimit: data.creditLimit,
      accountId: data.accountId,
      status: 'ACTIVE',
    },
    include: {
      account: {
        select: {
          accountNumber: true,
          accountType: true,
        },
      },
    },
  });

  return card;
}

// Update card status
export async function updateCardStatus(
  cardId: string,
  status: CardStatus,
  userId: string
) {
  // Verify card belongs to user
  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      account: {
        userId: userId,
      },
    },
  });

  if (!card) {
    throw new NotFoundError('Card not found');
  }

  // Update status
  const updatedCard = await prisma.card.update({
    where: { id: cardId },
    data: { status },
  });

  return updatedCard;
}

// Delete card
export async function deleteCard(cardId: string, userId: string) {
  // Verify card belongs to user
  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      account: {
        userId: userId,
      },
    },
  });

  if (!card) {
    throw new NotFoundError('Card not found');
  }

  // Delete card
  await prisma.card.delete({
    where: { id: cardId },
  });

  return { message: 'Card deleted successfully' };
}

// HELPER FUNCTIONS

// Generate random 16-digit card number
function generateCardNumber(): string {
  // First digit: 4 for Visa, 5 for Mastercard
  const firstDigit = Math.random() > 0.5 ? '4' : '5';
  
  let cardNumber = firstDigit;
  for (let i = 0; i < 15; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }
  
  return cardNumber;
}

// Generate random 3-digit CVV
function generateCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}
