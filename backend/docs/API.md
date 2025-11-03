# Banking API Documentation

Complete API reference for the Banking Dashboard Backend.

**Base URL:** `http://localhost:5000`  
**Version:** 1.0.0  
**Authentication:** JWT Bearer Token

---

## Table of Contents

- [Authentication](#authentication)
- [User Profile](#user-profile)
- [Accounts](#accounts)
- [Error Responses](#error-responses)
- [Rate Limiting](#rate-limiting)

---

## Authentication

All authentication endpoints for user registration, login, and session management.

### Register New User

Create a new user account.

**Endpoint:** `POST /api/auth/register`  
**Authentication:** None  
**Rate Limit:** 5 requests per 15 minutes

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Request Body Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char |
| firstName | string | Yes | User's first name |
| lastName | string | Yes | User's last name |

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses

**400 Bad Request** - Validation error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**409 Conflict** - Email already exists
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**429 Too Many Requests** - Rate limit exceeded
```json
{
  "success": false,
  "message": "Too many authentication attempts, please try again after 15 minutes."
}
```

#### Example (cURL)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

---

### Login

Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`  
**Authentication:** None  
**Rate Limit:** 5 requests per 15 minutes (failed attempts only)

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "dateOfBirth": "1990-05-15T00:00:00.000Z",
      "address": "123 Main St, City, State 12345",
      "role": "USER",
      "isActive": true,
      "lastLogin": "2025-01-15T10:30:00Z",
      "createdAt": "2025-01-10T10:00:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses

**401 Unauthorized** - Invalid credentials
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### Example (cURL)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

---

### Get Current User

Get authenticated user's information.

**Endpoint:** `GET /api/auth/me`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 100 requests per 15 minutes

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "address": "123 Main St, City, State 12345",
    "role": "USER",
    "isActive": true,
    "lastLogin": "2025-01-15T10:30:00Z",
    "createdAt": "2025-01-10T10:00:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

#### Error Responses

**401 Unauthorized** - Invalid or missing token
```json
{
  "success": false,
  "message": "No token provided"
}
```

#### Example (cURL)

```bash
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

### Logout

Logout (client-side token invalidation).

**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 100 requests per 15 minutes

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Profile

Endpoints for managing user profile information.

### Get Profile

Get current user's detailed profile.

**Endpoint:** `GET /api/user/profile`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 100 requests per 15 minutes

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "address": "123 Main St, City, State 12345",
    "role": "USER",
    "isActive": true,
    "createdAt": "2025-01-10T10:00:00Z",
    "updatedAt": "2025-01-15T10:30:00Z",
    "lastLogin": "2025-01-15T10:30:00Z"
  }
}
```

---

### Update Profile

Update user profile information.

**Endpoint:** `PUT /api/user/profile`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 100 requests per 15 minutes

#### Request Body

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+1987654321",
  "dateOfBirth": "1992-08-20",
  "address": "456 Oak Ave, NewCity, State 54321"
}
```

#### Request Body Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| firstName | string | No | User's first name (min 1 char) |
| lastName | string | No | User's last name (min 1 char) |
| phoneNumber | string | No | Valid phone number (E.164 format) |
| dateOfBirth | string | No | Date in past (YYYY-MM-DD) |
| address | string | No | User's address |

**Note:** All fields are optional. Only provided fields will be updated.

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phoneNumber": "+1987654321",
    "dateOfBirth": "1992-08-20T00:00:00.000Z",
    "address": "456 Oak Ave, NewCity, State 54321",
    "role": "USER",
    "updatedAt": "2025-01-15T11:00:00Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Validation error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "phoneNumber",
      "message": "Invalid phone number format"
    }
  ]
}
```

---

### Change Password

Change user's password (requires current password).

**Endpoint:** `PUT /api/user/password`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 3 requests per 1 hour

#### Request Body

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

#### Request Body Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| currentPassword | string | Yes | Current password |
| newPassword | string | Yes | New password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char) |
| confirmPassword | string | Yes | Must match newPassword |

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Error Responses

**401 Unauthorized** - Current password incorrect
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**400 Bad Request** - Passwords don't match
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "confirmPassword",
      "message": "Passwords do not match"
    }
  ]
}
```

---

## Accounts

Endpoints for viewing bank accounts and transactions.

### Get All Accounts

Get list of user's bank accounts with optional filtering and pagination.

**Endpoint:** `GET /api/accounts`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 100 requests per 15 minutes

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| type | string | No | - | Filter by account type: CHECKING, SAVINGS, CREDIT |
| limit | number | No | 10 | Results per page (1-100) |
| offset | number | No | 0 | Number of results to skip |

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "accountNumber": "1234567890",
      "accountType": "CHECKING",
      "balance": "5000.00",
      "currency": "USD",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": "uuid",
      "accountNumber": "0987654321",
      "accountType": "SAVINGS",
      "balance": "15000.00",
      "currency": "USD",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

#### Examples

**Get all accounts:**
```bash
curl -X GET "http://localhost:5000/api/accounts" \
  -H "Authorization: Bearer $TOKEN"
```

**Filter by type:**
```bash
curl -X GET "http://localhost:5000/api/accounts?type=SAVINGS" \
  -H "Authorization: Bearer $TOKEN"
```

**Pagination:**
```bash
curl -X GET "http://localhost:5000/api/accounts?limit=5&offset=0" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Get Account Summary

Get summary of all accounts (total balance, breakdown by type).

**Endpoint:** `GET /api/accounts/summary`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 100 requests per 15 minutes

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "totalBalance": 19500,
    "checking": 5000,
    "savings": 15000,
    "credit": -500,
    "accountCount": 3
  }
}
```

---

### Get Account by ID

Get specific account details.

**Endpoint:** `GET /api/accounts/:id`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 100 requests per 15 minutes

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | Account ID |

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "accountNumber": "1234567890",
    "accountType": "CHECKING",
    "balance": "5000.00",
    "currency": "USD",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

#### Error Responses

**404 Not Found** - Account doesn't exist
```json
{
  "success": false,
  "message": "Account not found"
}
```

**403 Forbidden** - User doesn't own this account
```json
{
  "success": false,
  "message": "You do not have access to this account"
}
```

---

### Get Account Transactions

Get transaction history for a specific account.

**Endpoint:** `GET /api/accounts/:id/transactions`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 100 requests per 15 minutes

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | Account ID |

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| type | string | No | - | Filter by type: DEBIT, CREDIT |
| startDate | string | No | - | Start date (YYYY-MM-DD) |
| endDate | string | No | - | End date (YYYY-MM-DD) |
| limit | number | No | 20 | Results per page (1-100) |
| offset | number | No | 0 | Number of results to skip |

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "CREDIT",
      "category": "SALARY",
      "amount": "3000.00",
      "description": "Monthly salary deposit",
      "merchant": "ABC Corp",
      "balanceAfter": "8000.00",
      "createdAt": "2025-01-15T09:00:00Z"
    },
    {
      "id": "uuid",
      "type": "DEBIT",
      "category": "GROCERIES",
      "amount": "-50.25",
      "description": "Whole Foods Market",
      "merchant": "Whole Foods",
      "balanceAfter": "7949.75",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### Examples

**Get all transactions:**
```bash
curl -X GET "http://localhost:5000/api/accounts/ACCOUNT_ID/transactions" \
  -H "Authorization: Bearer $TOKEN"
```

**Filter by type:**
```bash
curl -X GET "http://localhost:5000/api/accounts/ACCOUNT_ID/transactions?type=CREDIT" \
  -H "Authorization: Bearer $TOKEN"
```

**Filter by date range:**
```bash
curl -X GET "http://localhost:5000/api/accounts/ACCOUNT_ID/transactions?startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Responses

Standard error response format used across all endpoints.

### Error Response Structure

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data (validation error) |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

API requests are rate limited to prevent abuse.

### Rate Limit Headers

Every response includes rate limit information:

```
RateLimit-Policy: 100;w=900
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 745
```

| Header | Description |
|--------|-------------|
| RateLimit-Limit | Maximum requests allowed in window |
| RateLimit-Remaining | Requests remaining in current window |
| RateLimit-Reset | Seconds until limit resets |

### Rate Limits by Endpoint Group

| Endpoint Group | Limit | Window |
|----------------|-------|--------|
| General API | 100 requests | 15 minutes |
| Auth (Login/Register) | 5 requests | 15 minutes |
| Password Change | 3 requests | 1 hour |

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

**HTTP Status:** 429 Too Many Requests

---

## Authentication

### JWT Token

All protected endpoints require a valid JWT token in the Authorization header.

**Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

**Token Expiration:** 7 days

### Getting a Token

1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login`

Both endpoints return a token in the response:

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Token Payload

Decoded token contains:

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1704960000,
  "exp": 1705564800
}
```

---

## Testing with cURL

### Complete Workflow Example

**1. Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**2. Login and save token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123!"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)
```

**3. Use token for authenticated requests:**
```bash
# Get profile
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"

# Get accounts
curl -X GET http://localhost:5000/api/accounts \
  -H "Authorization: Bearer $TOKEN"

# Update profile
curl -X PUT http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Updated", "phoneNumber": "+1234567890"}'
```

---

## Security

### HTTPS Required (Production)

Always use HTTPS in production to protect:
- JWT tokens
- Passwords
- Personal information

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Security Headers

All responses include security headers via Helmet.js:
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- And more...

---

## Support

For issues or questions:
- GitHub Issues: [Repository URL]
- Email: support@example.com

---

**Last Updated:** January 2025  
**API Version:** 1.0.0
