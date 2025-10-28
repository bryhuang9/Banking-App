# Database Schema

Complete database schema for the Bank Dashboard application using PostgreSQL with Prisma ORM.

---

## Entity Relationship Diagram (Text)

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│    User     │1      *│   Account    │1      *│    Card      │
│─────────────│─────────│──────────────│─────────│──────────────│
│ id          │         │ id           │         │ id           │
│ name        │         │ userId  (FK) │         │ accountId(FK)│
│ email       │         │ type         │         │ cardNumber   │
│ password    │         │ balance      │         │ cardType     │
│ phone       │         │ currency     │         │ brand        │
│ role        │         │ status       │         │ expiryDate   │
│ status      │         │ ...          │         │ status       │
│ ...         │         └──────┬───────┘         │ ...          │
└─────────────┘                │                 └──────────────┘
                               │
                               │1
                               │
                               │*
                        ┌──────┴────────┐
                        │  Transaction  │
                        │───────────────│
                        │ id            │
                        │ accountId (FK)│
                        │ cardId (FK)   │
                        │ amount        │
                        │ type          │
                        │ category      │
                        │ description   │
                        │ merchant      │
                        │ date          │
                        │ status        │
                        │ ...           │
                        └───────────────┘

┌──────────────┐
│   Transfer   │
│──────────────│
│ id           │
│ fromAccId(FK)│
│ toAccId (FK) │
│ amount       │
│ type         │
│ status       │
│ date         │
│ ...          │
└──────────────┘
```

---

## Tables

### User

**Description:** Stores user account information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| name | VARCHAR(100) | NOT NULL | User's full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| password | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| phone | VARCHAR(20) | NULLABLE | Phone number |
| role | ENUM | NOT NULL, DEFAULT 'USER' | Role: USER, ADMIN |
| status | ENUM | NOT NULL, DEFAULT 'ACTIVE' | Status: ACTIVE, INACTIVE, SUSPENDED |
| emailVerified | BOOLEAN | DEFAULT FALSE | Email verification status |
| createdAt | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| updatedAt | TIMESTAMP | AUTO UPDATE | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`
- INDEX on `role`
- INDEX on `status`

**Example Row:**
```sql
id: "550e8400-e29b-41d4-a716-446655440000"
name: "John Doe"
email: "john@example.com"
password: "$2b$10$YourHashedPasswordHere"
phone: "+1234567890"
role: "USER"
status: "ACTIVE"
emailVerified: true
createdAt: "2025-01-15 10:00:00"
updatedAt: "2025-10-27 10:00:00"
```

---

### Account

**Description:** Bank accounts belonging to users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique account identifier |
| userId | UUID | FOREIGN KEY → User.id | Owner of the account |
| type | ENUM | NOT NULL | Type: CHECKING, SAVINGS, CREDIT |
| balance | DECIMAL(15,2) | NOT NULL, DEFAULT 0.00 | Current balance |
| currency | VARCHAR(3) | NOT NULL, DEFAULT 'USD' | Currency code (ISO 4217) |
| accountNumber | VARCHAR(20) | UNIQUE, NOT NULL | Account number |
| routingNumber | VARCHAR(9) | NOT NULL | Bank routing number |
| status | ENUM | NOT NULL, DEFAULT 'ACTIVE' | Status: ACTIVE, CLOSED, FROZEN |
| overdraftLimit | DECIMAL(10,2) | NULLABLE | Overdraft protection limit |
| interestRate | DECIMAL(5,2) | NULLABLE | Interest rate (for savings) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| updatedAt | TIMESTAMP | AUTO UPDATE | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `userId` → User.id (ON DELETE CASCADE)
- UNIQUE INDEX on `accountNumber`
- INDEX on `userId`
- INDEX on `type`
- INDEX on `status`

**Example Row:**
```sql
id: "650e8400-e29b-41d4-a716-446655440001"
userId: "550e8400-e29b-41d4-a716-446655440000"
type: "CHECKING"
balance: 5420.50
currency: "USD"
accountNumber: "1234567890"
routingNumber: "987654321"
status: "ACTIVE"
overdraftLimit: 500.00
interestRate: null
createdAt: "2025-01-15 10:00:00"
updatedAt: "2025-10-27 10:00:00"
```

---

### Card

**Description:** Debit and credit cards linked to accounts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique card identifier |
| accountId | UUID | FOREIGN KEY → Account.id | Linked account |
| cardNumber | VARCHAR(16) | UNIQUE, NOT NULL | Card number (encrypted) |
| cardNumberLast4 | VARCHAR(4) | NOT NULL | Last 4 digits (for display) |
| cardType | ENUM | NOT NULL | Type: DEBIT, CREDIT |
| brand | ENUM | NOT NULL | Brand: VISA, MASTERCARD, AMEX |
| expiryMonth | INTEGER | NOT NULL | Expiry month (1-12) |
| expiryYear | INTEGER | NOT NULL | Expiry year (YYYY) |
| cvv | VARCHAR(4) | NOT NULL | CVV (encrypted) |
| status | ENUM | NOT NULL, DEFAULT 'ACTIVE' | Status: ACTIVE, INACTIVE, BLOCKED, EXPIRED |
| creditLimit | DECIMAL(10,2) | NULLABLE | Credit limit (for credit cards) |
| availableCredit | DECIMAL(10,2) | NULLABLE | Available credit |
| pin | VARCHAR(255) | NULLABLE | PIN (encrypted) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Card creation timestamp |
| updatedAt | TIMESTAMP | AUTO UPDATE | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `accountId` → Account.id (ON DELETE CASCADE)
- UNIQUE INDEX on `cardNumber`
- INDEX on `accountId`
- INDEX on `status`
- INDEX on `cardType`

**Example Row:**
```sql
id: "750e8400-e29b-41d4-a716-446655440002"
accountId: "650e8400-e29b-41d4-a716-446655440001"
cardNumber: "4532123456781234" (encrypted in DB)
cardNumberLast4: "1234"
cardType: "DEBIT"
brand: "VISA"
expiryMonth: 12
expiryYear: 2027
cvv: "123" (encrypted in DB)
status: "ACTIVE"
creditLimit: null
availableCredit: null
pin: "encrypted_pin"
createdAt: "2025-01-15 10:00:00"
updatedAt: "2025-10-27 10:00:00"
```

---

### Transaction

**Description:** All financial transactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique transaction identifier |
| accountId | UUID | FOREIGN KEY → Account.id | Account involved |
| cardId | UUID | FOREIGN KEY → Card.id, NULLABLE | Card used (if applicable) |
| amount | DECIMAL(15,2) | NOT NULL | Transaction amount |
| type | ENUM | NOT NULL | Type: DEBIT, CREDIT |
| category | ENUM | NOT NULL | Category (see categories below) |
| description | VARCHAR(255) | NOT NULL | Transaction description |
| merchant | VARCHAR(100) | NULLABLE | Merchant name |
| merchantCategory | VARCHAR(50) | NULLABLE | Merchant category code |
| date | TIMESTAMP | NOT NULL | Transaction date |
| status | ENUM | NOT NULL, DEFAULT 'COMPLETED' | Status: PENDING, COMPLETED, FAILED, REVERSED |
| balanceAfter | DECIMAL(15,2) | NOT NULL | Account balance after transaction |
| location | VARCHAR(100) | NULLABLE | Transaction location |
| metadata | JSONB | NULLABLE | Additional metadata |
| createdAt | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | AUTO UPDATE | Last update timestamp |

**Transaction Categories:**
- GROCERIES
- DINING
- SHOPPING
- ENTERTAINMENT
- TRANSPORTATION
- UTILITIES
- HEALTHCARE
- EDUCATION
- TRAVEL
- TRANSFER
- SALARY
- INVESTMENT
- OTHER

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `accountId` → Account.id (ON DELETE CASCADE)
- FOREIGN KEY on `cardId` → Card.id (ON DELETE SET NULL)
- INDEX on `accountId`
- INDEX on `cardId`
- INDEX on `date` (DESC)
- INDEX on `category`
- INDEX on `type`
- INDEX on `status`
- COMPOSITE INDEX on (`accountId`, `date`)
- FULL TEXT INDEX on `description`

**Example Row:**
```sql
id: "850e8400-e29b-41d4-a716-446655440003"
accountId: "650e8400-e29b-41d4-a716-446655440001"
cardId: "750e8400-e29b-41d4-a716-446655440002"
amount: -45.99
type: "DEBIT"
category: "SHOPPING"
description: "Amazon Purchase"
merchant: "Amazon"
merchantCategory: "E-COMMERCE"
date: "2025-10-26 14:30:00"
status: "COMPLETED"
balanceAfter: 5374.51
location: "Online"
metadata: {"orderId": "112-3456789-0123456"}
createdAt: "2025-10-26 14:30:00"
updatedAt: "2025-10-26 14:30:00"
```

---

### Transfer

**Description:** Money transfers between accounts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique transfer identifier |
| fromAccountId | UUID | FOREIGN KEY → Account.id | Source account |
| toAccountId | UUID | FOREIGN KEY → Account.id, NULLABLE | Destination account (null for external) |
| amount | DECIMAL(15,2) | NOT NULL | Transfer amount |
| transferType | ENUM | NOT NULL | Type: INTERNAL, EXTERNAL |
| description | VARCHAR(255) | NULLABLE | Transfer description |
| recipientName | VARCHAR(100) | NULLABLE | External recipient name |
| recipientAccount | VARCHAR(20) | NULLABLE | External recipient account |
| recipientBank | VARCHAR(100) | NULLABLE | External recipient bank |
| routingNumber | VARCHAR(9) | NULLABLE | External routing number |
| status | ENUM | NOT NULL, DEFAULT 'PENDING' | Status: PENDING, COMPLETED, FAILED, CANCELLED |
| date | TIMESTAMP | NOT NULL | Transfer initiation date |
| completedAt | TIMESTAMP | NULLABLE | Transfer completion timestamp |
| debitTransactionId | UUID | FOREIGN KEY → Transaction.id, NULLABLE | Associated debit transaction |
| creditTransactionId | UUID | FOREIGN KEY → Transaction.id, NULLABLE | Associated credit transaction |
| failureReason | VARCHAR(255) | NULLABLE | Reason for failure |
| createdAt | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updatedAt | TIMESTAMP | AUTO UPDATE | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `fromAccountId` → Account.id (ON DELETE CASCADE)
- FOREIGN KEY on `toAccountId` → Account.id (ON DELETE SET NULL)
- FOREIGN KEY on `debitTransactionId` → Transaction.id
- FOREIGN KEY on `creditTransactionId` → Transaction.id
- INDEX on `fromAccountId`
- INDEX on `toAccountId`
- INDEX on `date` (DESC)
- INDEX on `status`
- INDEX on `transferType`

**Example Row:**
```sql
id: "950e8400-e29b-41d4-a716-446655440004"
fromAccountId: "650e8400-e29b-41d4-a716-446655440001"
toAccountId: "650e8400-e29b-41d4-a716-446655440002"
amount: 500.00
transferType: "INTERNAL"
description: "Monthly savings"
recipientName: null
recipientAccount: null
recipientBank: null
routingNumber: null
status: "COMPLETED"
date: "2025-10-27 10:00:00"
completedAt: "2025-10-27 10:00:01"
debitTransactionId: "a50e8400-e29b-41d4-a716-446655440005"
creditTransactionId: "a50e8400-e29b-41d4-a716-446655440006"
failureReason: null
createdAt: "2025-10-27 10:00:00"
updatedAt: "2025-10-27 10:00:01"
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum AccountType {
  CHECKING
  SAVINGS
  CREDIT
}

enum AccountStatus {
  ACTIVE
  CLOSED
  FROZEN
}

enum CardType {
  DEBIT
  CREDIT
}

enum CardBrand {
  VISA
  MASTERCARD
  AMEX
  DISCOVER
}

enum CardStatus {
  ACTIVE
  INACTIVE
  BLOCKED
  EXPIRED
}

enum TransactionType {
  DEBIT
  CREDIT
}

enum TransactionCategory {
  GROCERIES
  DINING
  SHOPPING
  ENTERTAINMENT
  TRANSPORTATION
  UTILITIES
  HEALTHCARE
  EDUCATION
  TRAVEL
  TRANSFER
  SALARY
  INVESTMENT
  OTHER
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  REVERSED
}

enum TransferType {
  INTERNAL
  EXTERNAL
}

enum TransferStatus {
  PENDING
  COMPLETED
  FAILED
  CANCELLED
}

model User {
  id            String      @id @default(uuid())
  name          String      @db.VarChar(100)
  email         String      @unique @db.VarChar(255)
  password      String      @db.VarChar(255)
  phone         String?     @db.VarChar(20)
  role          UserRole    @default(USER)
  status        UserStatus  @default(ACTIVE)
  emailVerified Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  accounts      Account[]

  @@index([email])
  @@index([role])
  @@index([status])
}

model Account {
  id              String        @id @default(uuid())
  userId          String
  type            AccountType
  balance         Decimal       @default(0.00) @db.Decimal(15, 2)
  currency        String        @default("USD") @db.VarChar(3)
  accountNumber   String        @unique @db.VarChar(20)
  routingNumber   String        @db.VarChar(9)
  status          AccountStatus @default(ACTIVE)
  overdraftLimit  Decimal?      @db.Decimal(10, 2)
  interestRate    Decimal?      @db.Decimal(5, 2)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  cards           Card[]
  transactions    Transaction[]
  transfersFrom   Transfer[]    @relation("TransfersFrom")
  transfersTo     Transfer[]    @relation("TransfersTo")

  @@index([userId])
  @@index([accountNumber])
  @@index([type])
  @@index([status])
}

model Card {
  id               String       @id @default(uuid())
  accountId        String
  cardNumber       String       @unique @db.VarChar(16)
  cardNumberLast4  String       @db.VarChar(4)
  cardType         CardType
  brand            CardBrand
  expiryMonth      Int
  expiryYear       Int
  cvv              String       @db.VarChar(4)
  status           CardStatus   @default(ACTIVE)
  creditLimit      Decimal?     @db.Decimal(10, 2)
  availableCredit  Decimal?     @db.Decimal(10, 2)
  pin              String?      @db.VarChar(255)
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  account          Account      @relation(fields: [accountId], references: [id], onDelete: Cascade)
  transactions     Transaction[]

  @@index([accountId])
  @@index([cardNumberLast4])
  @@index([status])
  @@index([cardType])
}

model Transaction {
  id               String              @id @default(uuid())
  accountId        String
  cardId           String?
  amount           Decimal             @db.Decimal(15, 2)
  type             TransactionType
  category         TransactionCategory
  description      String              @db.VarChar(255)
  merchant         String?             @db.VarChar(100)
  merchantCategory String?             @db.VarChar(50)
  date             DateTime
  status           TransactionStatus   @default(COMPLETED)
  balanceAfter     Decimal             @db.Decimal(15, 2)
  location         String?             @db.VarChar(100)
  metadata         Json?
  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @updatedAt

  account          Account             @relation(fields: [accountId], references: [id], onDelete: Cascade)
  card             Card?               @relation(fields: [cardId], references: [id], onDelete: SetNull)

  @@index([accountId])
  @@index([cardId])
  @@index([date(sort: Desc)])
  @@index([category])
  @@index([type])
  @@index([status])
  @@index([accountId, date])
}

model Transfer {
  id                  String         @id @default(uuid())
  fromAccountId       String
  toAccountId         String?
  amount              Decimal        @db.Decimal(15, 2)
  transferType        TransferType
  description         String?        @db.VarChar(255)
  recipientName       String?        @db.VarChar(100)
  recipientAccount    String?        @db.VarChar(20)
  recipientBank       String?        @db.VarChar(100)
  routingNumber       String?        @db.VarChar(9)
  status              TransferStatus @default(PENDING)
  date                DateTime
  completedAt         DateTime?
  debitTransactionId  String?
  creditTransactionId String?
  failureReason       String?        @db.VarChar(255)
  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt

  fromAccount         Account        @relation("TransfersFrom", fields: [fromAccountId], references: [id], onDelete: Cascade)
  toAccount           Account?       @relation("TransfersTo", fields: [toAccountId], references: [id], onDelete: SetNull)

  @@index([fromAccountId])
  @@index([toAccountId])
  @@index([date(sort: Desc)])
  @@index([status])
  @@index([transferType])
}
```

---

## Sample Data

### Seed Data Structure

The seed script should create:

1. **Users:**
   - 1 Admin user
   - 5-10 Regular users

2. **Accounts per user:**
   - 1 Checking account
   - 1 Savings account
   - Optional: 1 Credit account

3. **Cards per user:**
   - 1-2 Debit cards
   - Optional: 1 Credit card

4. **Transactions:**
   - 50-200 transactions per user
   - Various categories
   - Mix of debits and credits
   - Realistic amounts and dates

5. **Transfers:**
   - 5-10 transfers per user
   - Mix of internal and external

---

## Database Migrations

### Initial Migration

```bash
npx prisma migrate dev --name init
```

### Adding Indexes

```bash
npx prisma migrate dev --name add_indexes
```

### Data Seeding

```bash
npx prisma db seed
```

---

## Query Optimization

### Common Queries

1. **Get user with all accounts:**
```prisma
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { accounts: true }
});
```

2. **Get transactions with pagination:**
```prisma
const transactions = await prisma.transaction.findMany({
  where: { accountId },
  orderBy: { date: 'desc' },
  skip: (page - 1) * limit,
  take: limit
});
```

3. **Get spending by category:**
```prisma
const spending = await prisma.transaction.groupBy({
  by: ['category'],
  where: {
    accountId,
    type: 'DEBIT',
    date: { gte: startDate, lte: endDate }
  },
  _sum: { amount: true },
  _count: true
});
```

---

## Backup Strategy

1. **Daily automated backups**
2. **Point-in-time recovery enabled**
3. **Backup retention: 30 days**
4. **Test restore monthly**

---

**Last Updated:** 2025-10-27
