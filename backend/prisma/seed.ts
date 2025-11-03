// This file creates SAMPLE DATA in your database for testing
// Think of it like: Setting up a demo store with fake products before opening

import { PrismaClient } from '@prisma/client'; // Import Prisma (our database helper)
import * as bcrypt from 'bcrypt'; // Import bcrypt (password encryption)

// Create a Prisma client - this is how we talk to the database
const prisma = new PrismaClient();

// Main function - async means it can wait for slow operations (like database calls)
async function main() {
  console.log('🌱 Starting database seeding...');

  // STEP 1: Hash the password
  // Why? We NEVER store passwords as plain text (security!)
  // "Demo123!" becomes something like "$2b$10$xyz..." (can't be reversed)
  const hashedPassword = await bcrypt.hash('Demo123!', 10); // 10 = security rounds (higher = slower but more secure)

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '+1234567890',
      role: 'ADMIN',
      dateOfBirth: new Date('1990-01-01'),
      address: '123 Admin St, New York, NY 10001',
    },
  });

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@demo.com' },
    update: {},
    create: {
      email: 'user@demo.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1987654321',
      role: 'USER',
      dateOfBirth: new Date('1995-05-15'),
      address: '456 User Ave, Los Angeles, CA 90001',
    },
  });

  console.log('✅ Users created');

  // Create accounts for regular user
  const checkingAccount = await prisma.account.create({
    data: {
      accountNumber: '1234567890',
      accountType: 'CHECKING',
      balance: 5000.00,
      currency: 'USD',
      userId: user.id,
    },
  });

  await prisma.account.create({
    data: {
      accountNumber: '0987654321',
      accountType: 'SAVINGS',
      balance: 15000.00,
      currency: 'USD',
      userId: user.id,
    },
  });

  const creditAccount = await prisma.account.create({
    data: {
      accountNumber: '5555666677',
      accountType: 'CREDIT',
      balance: -500.00, // Negative balance for credit
      currency: 'USD',
      userId: user.id,
    },
  });

  console.log('✅ Accounts created');

  // Create cards
  const debitCard = await prisma.card.create({
    data: {
      cardNumber: '4532123456789012',
      cardType: 'DEBIT',
      cardholderName: 'JOHN DOE',
      expiryDate: new Date('2027-12-31'),
      cvv: '123',
      status: 'ACTIVE',
      accountId: checkingAccount.id,
    },
  });

  const creditCard = await prisma.card.create({
    data: {
      cardNumber: '5425233430109903',
      cardType: 'CREDIT',
      cardholderName: 'JOHN DOE',
      expiryDate: new Date('2028-06-30'),
      cvv: '456',
      status: 'ACTIVE',
      creditLimit: 10000.00,
      accountId: creditAccount.id,
    },
  });

  console.log('✅ Cards created');

  // Create transactions for checking account
  const transactions = [
    {
      amount: -50.25,
      type: 'DEBIT' as const,
      category: 'GROCERIES' as const,
      description: 'Whole Foods Market',
      merchant: 'Whole Foods',
      accountId: checkingAccount.id,
      cardId: debitCard.id,
      balanceAfter: 4949.75,
      createdAt: new Date('2025-01-15T10:30:00Z'),
    },
    {
      amount: -30.00,
      type: 'DEBIT' as const,
      category: 'TRANSPORTATION' as const,
      description: 'Uber ride to downtown',
      merchant: 'Uber',
      accountId: checkingAccount.id,
      cardId: debitCard.id,
      balanceAfter: 4919.75,
      createdAt: new Date('2025-01-16T14:20:00Z'),
    },
    {
      amount: 3000.00,
      type: 'CREDIT' as const,
      category: 'SALARY' as const,
      description: 'Monthly salary deposit',
      merchant: 'ABC Corp',
      accountId: checkingAccount.id,
      balanceAfter: 7919.75,
      createdAt: new Date('2025-01-20T09:00:00Z'),
    },
    {
      amount: -75.50,
      type: 'DEBIT' as const,
      category: 'DINING' as const,
      description: 'Dinner at Italian Restaurant',
      merchant: 'La Trattoria',
      accountId: checkingAccount.id,
      cardId: debitCard.id,
      balanceAfter: 7844.25,
      createdAt: new Date('2025-01-22T19:45:00Z'),
    },
    {
      amount: -120.00,
      type: 'DEBIT' as const,
      category: 'UTILITIES' as const,
      description: 'Electric bill payment',
      merchant: 'City Power',
      accountId: checkingAccount.id,
      balanceAfter: 7724.25,
      createdAt: new Date('2025-01-25T08:00:00Z'),
    },
  ];

  await prisma.transaction.createMany({
    data: transactions,
  });

  // Create credit card transactions
  const creditTransactions = [
    {
      amount: -200.00,
      type: 'DEBIT' as const,
      category: 'SHOPPING' as const,
      description: 'Amazon purchase',
      merchant: 'Amazon',
      accountId: creditAccount.id,
      cardId: creditCard.id,
      balanceAfter: -700.00,
      createdAt: new Date('2025-01-18T16:30:00Z'),
    },
    {
      amount: -100.00,
      type: 'DEBIT' as const,
      category: 'ENTERTAINMENT' as const,
      description: 'Movie tickets and snacks',
      merchant: 'AMC Theaters',
      accountId: creditAccount.id,
      cardId: creditCard.id,
      balanceAfter: -800.00,
      createdAt: new Date('2025-01-21T20:15:00Z'),
    },
    {
      amount: 300.00,
      type: 'CREDIT' as const,
      category: 'TRANSFER' as const,
      description: 'Credit card payment',
      accountId: creditAccount.id,
      balanceAfter: -500.00,
      createdAt: new Date('2025-01-26T12:00:00Z'),
    },
  ];

  await prisma.transaction.createMany({
    data: creditTransactions,
  });

  console.log('✅ Transactions created');

  // Update account balances to match last transaction
  await prisma.account.update({
    where: { id: checkingAccount.id },
    data: { balance: 5000.00 },
  });

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📧 Demo Credentials:');
  console.log('Admin: admin@demo.com / Demo123!');
  console.log('User:  user@demo.com / Demo123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
