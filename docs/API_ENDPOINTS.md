# API Endpoints Documentation

Complete API specification for the Bank Dashboard application.

**Base URL:** `http://localhost:5000/api`  
**API Version:** v1  
**Authentication:** JWT Bearer Token

---

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Accounts](#accounts)
4. [Transactions](#transactions)
5. [Cards](#cards)
6. [Transfers](#transfers)
7. [Analytics](#analytics)
8. [Admin](#admin-routes)

---

## Authentication

### Register User

```
POST /api/auth/register
```

**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2025-10-27T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- Email: Valid email format, unique
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Name: Required, 2-100 characters
- Phone: Optional, valid phone format

---

### Login

```
POST /api/auth/login
```

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "success": false,
  "error": {
    "message": "Invalid credentials"
  }
}
```

---

### Logout

```
POST /api/auth/logout
```

**Description:** Logout user (client-side token removal)

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Refresh Token (Optional)

```
POST /api/auth/refresh
```

**Description:** Refresh expired JWT token

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

## User Management

### Get Current User Profile

```
GET /api/user/profile
```

**Description:** Get authenticated user's profile

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "USER",
    "createdAt": "2025-10-27T10:00:00Z",
    "updatedAt": "2025-10-27T10:00:00Z"
  }
}
```

---

### Update User Profile

```
PUT /api/user/profile
```

**Description:** Update user profile information

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+0987654321"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+0987654321"
  }
}
```

---

### Change Password

```
PUT /api/user/password
```

**Description:** Change user password

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## Accounts

### Get All Accounts

```
GET /api/accounts
```

**Description:** Get all accounts for authenticated user

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "CHECKING",
      "balance": 5420.50,
      "currency": "USD",
      "accountNumber": "****1234",
      "status": "ACTIVE",
      "createdAt": "2025-01-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "type": "SAVINGS",
      "balance": 12350.00,
      "currency": "USD",
      "accountNumber": "****5678",
      "status": "ACTIVE",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### Get Account by ID

```
GET /api/accounts/:id
```

**Description:** Get specific account details

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "CHECKING",
    "balance": 5420.50,
    "currency": "USD",
    "accountNumber": "1234567890",
    "routingNumber": "987654321",
    "status": "ACTIVE",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-10-27T10:00:00Z"
  }
}
```

---

### Get Account Transactions

```
GET /api/accounts/:id/transactions
```

**Description:** Get transactions for a specific account

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `startDate` (optional): Filter by start date (ISO 8601)
- `endDate` (optional): Filter by end date (ISO 8601)
- `category` (optional): Filter by category
- `type` (optional): Filter by type (DEBIT/CREDIT)

**Example:**
```
GET /api/accounts/uuid/transactions?page=1&limit=20&category=SHOPPING
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "amount": -45.99,
        "type": "DEBIT",
        "category": "SHOPPING",
        "description": "Amazon Purchase",
        "merchant": "Amazon",
        "date": "2025-10-26T14:30:00Z",
        "status": "COMPLETED"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

## Transactions

### Get All Transactions

```
GET /api/transactions
```

**Description:** Get all transactions for authenticated user across all accounts

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `category`: Filter by category
- `type`: DEBIT or CREDIT
- `minAmount`: Minimum amount
- `maxAmount`: Maximum amount
- `search`: Search in description/merchant

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 250,
      "totalPages": 13
    }
  }
}
```

---

### Get Transaction by ID

```
GET /api/transactions/:id
```

**Description:** Get detailed transaction information

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "accountId": "uuid",
    "amount": -45.99,
    "type": "DEBIT",
    "category": "SHOPPING",
    "description": "Amazon Purchase",
    "merchant": "Amazon",
    "merchantCategory": "E-COMMERCE",
    "date": "2025-10-26T14:30:00Z",
    "status": "COMPLETED",
    "balance": 5374.51,
    "metadata": {
      "location": "Online",
      "paymentMethod": "Card ending in 1234"
    }
  }
}
```

---

### Update Transaction Category

```
PATCH /api/transactions/:id/category
```

**Description:** Update transaction category

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "category": "ENTERTAINMENT"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "category": "ENTERTAINMENT"
  }
}
```

---

## Cards

### Get All Cards

```
GET /api/cards
```

**Description:** Get all cards for authenticated user

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "accountId": "uuid",
      "cardNumber": "****1234",
      "cardType": "DEBIT",
      "brand": "VISA",
      "expiryDate": "2027-12",
      "cvv": "***",
      "status": "ACTIVE",
      "limit": null,
      "balance": 5420.50,
      "createdAt": "2025-01-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "accountId": "uuid",
      "cardNumber": "****5678",
      "cardType": "CREDIT",
      "brand": "MASTERCARD",
      "expiryDate": "2026-08",
      "status": "ACTIVE",
      "limit": 10000.00,
      "balance": 2150.00,
      "createdAt": "2025-03-20T10:00:00Z"
    }
  ]
}
```

---

### Get Card by ID

```
GET /api/cards/:id
```

**Description:** Get specific card details

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "accountId": "uuid",
    "cardNumber": "4532123456781234",
    "cardType": "DEBIT",
    "brand": "VISA",
    "expiryDate": "2027-12",
    "cvv": "123",
    "status": "ACTIVE",
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

---

### Update Card Status

```
PATCH /api/cards/:id/status
```

**Description:** Toggle card active/inactive status

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "INACTIVE"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "INACTIVE",
    "updatedAt": "2025-10-27T10:00:00Z"
  }
}
```

---

### Request New Card

```
POST /api/cards
```

**Description:** Request a new card

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "accountId": "uuid",
  "cardType": "DEBIT",
  "brand": "VISA"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "accountId": "uuid",
    "cardNumber": "****9012",
    "cardType": "DEBIT",
    "brand": "VISA",
    "status": "PENDING",
    "message": "Card request submitted. You will receive it in 7-10 business days."
  }
}
```

---

### Get Card Transactions

```
GET /api/cards/:id/transactions
```

**Description:** Get transactions for a specific card

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:** Same as account transactions

**Response:** Same format as account transactions

---

## Transfers

### Create Transfer

```
POST /api/transfers
```

**Description:** Initiate a transfer between accounts

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fromAccountId": "uuid",
  "toAccountId": "uuid",
  "amount": 500.00,
  "description": "Monthly savings",
  "transferType": "INTERNAL"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fromAccountId": "uuid",
    "toAccountId": "uuid",
    "amount": 500.00,
    "description": "Monthly savings",
    "transferType": "INTERNAL",
    "status": "COMPLETED",
    "date": "2025-10-27T10:00:00Z",
    "transactionIds": ["uuid1", "uuid2"]
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "message": "Insufficient funds",
    "code": "INSUFFICIENT_FUNDS"
  }
}
```

---

### Get Transfer History

```
GET /api/transfers
```

**Description:** Get transfer history for authenticated user

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status (PENDING/COMPLETED/FAILED)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "transfers": [
      {
        "id": "uuid",
        "fromAccount": {
          "id": "uuid",
          "type": "CHECKING",
          "accountNumber": "****1234"
        },
        "toAccount": {
          "id": "uuid",
          "type": "SAVINGS",
          "accountNumber": "****5678"
        },
        "amount": 500.00,
        "status": "COMPLETED",
        "date": "2025-10-27T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

### External Transfer (Simulation)

```
POST /api/transfers/external
```

**Description:** Simulate external transfer

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fromAccountId": "uuid",
  "recipientName": "Jane Smith",
  "recipientAccount": "9876543210",
  "recipientBank": "Bank of Example",
  "routingNumber": "123456789",
  "amount": 1000.00,
  "description": "Payment"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "PENDING",
    "estimatedCompletion": "2025-10-28T10:00:00Z",
    "message": "External transfer initiated. Expected to complete in 1-3 business days."
  }
}
```

---

## Analytics

### Get Spending by Category

```
GET /api/analytics/spending-by-category
```

**Description:** Get spending breakdown by category

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `period`: TIME_PERIOD (WEEK/MONTH/YEAR)
- `startDate`: Custom start date (optional)
- `endDate`: Custom end date (optional)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "period": "MONTH",
    "startDate": "2025-10-01",
    "endDate": "2025-10-31",
    "categories": [
      {
        "category": "SHOPPING",
        "amount": 1250.50,
        "percentage": 35.2,
        "transactionCount": 15
      },
      {
        "category": "GROCERIES",
        "amount": 850.25,
        "percentage": 24.0,
        "transactionCount": 22
      },
      {
        "category": "DINING",
        "amount": 620.00,
        "percentage": 17.5,
        "transactionCount": 18
      }
    ],
    "totalSpent": 3545.75
  }
}
```

---

### Get Income vs Spending

```
GET /api/analytics/income-vs-spending
```

**Description:** Compare income and spending for a period

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `period`: TIME_PERIOD (WEEK/MONTH/YEAR)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "period": "MONTH",
    "income": 5500.00,
    "spending": 3545.75,
    "netSavings": 1954.25,
    "savingsRate": 35.5
  }
}
```

---

### Get Monthly Trends

```
GET /api/analytics/trends
```

**Description:** Get spending/income trends over time

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `months`: Number of months (default: 6, max: 24)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "month": "2025-10",
        "income": 5500.00,
        "spending": 3545.75,
        "savings": 1954.25
      },
      {
        "month": "2025-09",
        "income": 5500.00,
        "spending": 4120.50,
        "savings": 1379.50
      }
    ]
  }
}
```

---

## Admin Routes

### Get All Users (Admin Only)

```
GET /api/admin/users
```

**Description:** Get list of all users

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `search`: Search by name or email
- `role`: Filter by role

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "status": "ACTIVE",
        "accountCount": 2,
        "totalBalance": 17770.50,
        "createdAt": "2025-01-15T10:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

### Deactivate User (Admin Only)

```
PATCH /api/admin/users/:id/deactivate
```

**Description:** Deactivate a user account

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "INACTIVE",
    "deactivatedAt": "2025-10-27T10:00:00Z"
  }
}
```

---

### Get System Stats (Admin Only)

```
GET /api/admin/stats
```

**Description:** Get system-wide statistics

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 1180,
    "totalAccounts": 2450,
    "totalTransactions": 45680,
    "totalTransferVolume": 12500000.00,
    "avgAccountBalance": 7250.50
  }
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common HTTP Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Rate Limiting

- **Authentication endpoints:** 5 requests per 15 minutes per IP
- **General API:** 100 requests per 15 minutes per user
- **Admin endpoints:** 200 requests per 15 minutes

---

**Last Updated:** 2025-10-27
