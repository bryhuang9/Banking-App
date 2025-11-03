# Testing Guide

Complete guide for testing the Banking API endpoints.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Testing Authentication](#testing-authentication)
- [Testing User Profile](#testing-user-profile)
- [Testing Accounts](#testing-accounts)
- [Testing Rate Limiting](#testing-rate-limiting)
- [Testing Security](#testing-security)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **cURL** - Command-line HTTP client (pre-installed on Mac/Linux)
- **jq** (optional) - JSON processor for pretty output
  ```bash
  # Install on Mac
  brew install jq
  
  # Install on Linux
  sudo apt-get install jq
  ```

### Server Running

Ensure the backend server is running:

```bash
cd backend
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
```

---

## Setup

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/banking_db
JWT_SECRET=your_super_secret_key_min_32_chars_long
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### Test Data

The database is seeded with demo data:

**Admin User:**
- Email: `admin@demo.com`
- Password: `Admin123!`

**Regular User:**
- Email: `user@demo.com`
- Password: `Demo123!`

---

## Testing Authentication

### Test 1: Health Check

Verify server is running:

```bash
curl http://localhost:5000/health
```

**Expected Output:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

✅ **Success:** Server is running  
❌ **Failure:** Check if server is started

---

### Test 2: Register New User

Create a new user account:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "Test123!",
    "firstName": "New",
    "lastName": "User"
  }'
```

**Expected Output:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "newuser@test.com",
      "firstName": "New",
      "lastName": "User",
      "role": "USER",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

✅ **Success:** User created, token returned  
❌ **Failure:** Email already exists (409) or validation error (400)

---

### Test 3: Login

Login with existing credentials:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@demo.com",
    "password": "Demo123!"
  }'
```

**Expected Output:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user details */ },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Save the token for subsequent requests:**

```bash
# Save token to variable
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@demo.com", "password": "Demo123!"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

✅ **Success:** Login successful, token returned  
❌ **Failure:** Invalid credentials (401)

---

### Test 4: Get Current User

Get authenticated user's information:

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Output:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "user@demo.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "lastLogin": "2025-01-15T10:30:00Z"
  }
}
```

✅ **Success:** User details returned  
❌ **Failure:** No token (401) or invalid token (401)

---

### Test 5: Login with Wrong Password

Test authentication failure:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@demo.com",
    "password": "WrongPassword!"
  }'
```

**Expected Output:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

✅ **Success:** Returns 401 with error message  
❌ **Failure:** Accepts wrong password (security issue!)

---

## Testing User Profile

### Test 6: Get Profile

Get full user profile:

```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Output:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "user@demo.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1987654321",
    "dateOfBirth": "1995-05-15T00:00:00.000Z",
    "address": "456 User Ave, Los Angeles, CA 90001",
    "role": "USER",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "...",
    "lastLogin": "..."
  }
}
```

✅ **Success:** Full profile returned  
❌ **Failure:** Authentication required (401)

---

### Test 7: Update Profile

Update user information:

```bash
curl -X PUT http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "phoneNumber": "+1234567890",
    "address": "123 New Street, New City, State 12345"
  }'
```

**Expected Output:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "...",
    "email": "user@demo.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "address": "123 New Street, New City, State 12345",
    "role": "USER",
    "updatedAt": "2025-01-15T10:35:00Z"
  }
}
```

✅ **Success:** Profile updated with new values  
❌ **Failure:** Validation error (400)

---

### Test 8: Update Profile with Invalid Data

Test validation:

```bash
curl -X PUT http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "invalid123"
  }'
```

**Expected Output:**
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

✅ **Success:** Returns 400 with validation error  
❌ **Failure:** Accepts invalid data (validation not working!)

---

### Test 9: Change Password

Change user's password:

```bash
curl -X PUT http://localhost:5000/api/user/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Demo123!",
    "newPassword": "NewPass123!@",
    "confirmPassword": "NewPass123!@"
  }'
```

**Expected Output:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Verify new password works:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@demo.com",
    "password": "NewPass123!@"
  }'
```

✅ **Success:** Password changed, can login with new password  
❌ **Failure:** Wrong current password (401) or validation error (400)

**Reset password back:**
```bash
curl -X PUT http://localhost:5000/api/user/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "NewPass123!@",
    "newPassword": "Demo123!",
    "confirmPassword": "Demo123!"
  }'
```

---

## Testing Accounts

### Test 10: Get All Accounts

Get list of user's accounts:

```bash
curl -X GET http://localhost:5000/api/accounts \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Output:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "accountNumber": "1234567890",
      "accountType": "CHECKING",
      "balance": "5000.00",
      "currency": "USD",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    {
      "id": "...",
      "accountNumber": "0987654321",
      "accountType": "SAVINGS",
      "balance": "15000.00",
      "currency": "USD",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
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

✅ **Success:** Returns all user's accounts  
❌ **Failure:** Authentication required (401)

---

### Test 11: Filter Accounts by Type

Get only savings accounts:

```bash
curl -X GET "http://localhost:5000/api/accounts?type=SAVINGS" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Output:**
```json
{
  "success": true,
  "data": [
    {
      "accountType": "SAVINGS",
      "balance": "15000.00",
      ...
    }
  ],
  "pagination": { ... }
}
```

✅ **Success:** Returns only SAVINGS accounts  
❌ **Failure:** Returns all accounts (filter not working)

---

### Test 12: Pagination

Test pagination with limit and offset:

```bash
# Get first 2 accounts
curl -X GET "http://localhost:5000/api/accounts?limit=2&offset=0" \
  -H "Authorization: Bearer $TOKEN"

# Get next 2 accounts
curl -X GET "http://localhost:5000/api/accounts?limit=2&offset=2" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Output:**
```json
{
  "success": true,
  "data": [ /* 2 accounts */ ],
  "pagination": {
    "total": 3,
    "limit": 2,
    "offset": 0,
    "hasMore": true  // More pages available
  }
}
```

✅ **Success:** Returns correct number of items, hasMore is accurate  
❌ **Failure:** Pagination not working correctly

---

### Test 13: Get Account Summary

Get summary of all accounts:

```bash
curl -X GET http://localhost:5000/api/accounts/summary \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Output:**
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

✅ **Success:** Returns correct balance totals  
❌ **Failure:** Math is incorrect

---

### Test 14: Get Specific Account

Get details for one account:

```bash
# First, get account ID from list
ACCOUNT_ID="paste_account_id_here"

curl -X GET "http://localhost:5000/api/accounts/$ACCOUNT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Output:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "accountNumber": "1234567890",
    "accountType": "CHECKING",
    "balance": "5000.00",
    "currency": "USD",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

✅ **Success:** Returns account details  
❌ **Failure:** Not found (404) or forbidden (403)

---

### Test 15: Get Account Transactions

Get transaction history:

```bash
curl -X GET "http://localhost:5000/api/accounts/$ACCOUNT_ID/transactions?limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Output:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "type": "DEBIT",
      "category": "UTILITIES",
      "amount": "-120.00",
      "description": "Electric bill payment",
      "merchant": "City Power",
      "balanceAfter": "7724.25",
      "createdAt": "2025-01-25T08:00:00.000Z"
    },
    ...
  ],
  "pagination": {
    "total": 25,
    "limit": 5,
    "offset": 0,
    "hasMore": true
  }
}
```

✅ **Success:** Returns transactions for account  
❌ **Failure:** Empty list or wrong account

---

### Test 16: Filter Transactions by Type

Get only credit transactions (deposits):

```bash
curl -X GET "http://localhost:5000/api/accounts/$ACCOUNT_ID/transactions?type=CREDIT" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Output:**
```json
{
  "success": true,
  "data": [
    {
      "type": "CREDIT",
      "amount": "3000.00",
      "description": "Monthly salary deposit",
      ...
    }
  ],
  "pagination": { ... }
}
```

✅ **Success:** Returns only CREDIT transactions  
❌ **Failure:** Returns all transactions

---

### Test 17: Filter Transactions by Date

Get transactions in date range:

```bash
curl -X GET "http://localhost:5000/api/accounts/$ACCOUNT_ID/transactions?startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer $TOKEN"
```

✅ **Success:** Returns only transactions in date range  
❌ **Failure:** Date filter not working

---

### Test 18: Access Another User's Account

**Test authorization** - try to access account that doesn't belong to you:

```bash
# Use a different user's account ID
OTHER_ACCOUNT_ID="another_user_account_id"

curl -X GET "http://localhost:5000/api/accounts/$OTHER_ACCOUNT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Output:**
```json
{
  "success": false,
  "message": "You do not have access to this account"
}
```

**HTTP Status:** 403 Forbidden

✅ **Success:** Returns 403, doesn't expose other user's data  
❌ **Failure:** Returns data (SECURITY ISSUE!)

---

## Testing Rate Limiting

### Test 19: Rate Limit on Login

Test rate limiting prevents brute force:

```bash
# Try 6 failed login attempts (limit is 5)
for i in {1..6}; do
  echo "Attempt $i:"
  curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "user@demo.com", "password": "WrongPass!"}' \
    | head -c 150
  echo ""
  sleep 1
done
```

**Expected Output:**
```
Attempt 1: {"success":false,"message":"Invalid email or password"}
Attempt 2: {"success":false,"message":"Invalid email or password"}
Attempt 3: {"success":false,"message":"Invalid email or password"}
Attempt 4: {"success":false,"message":"Invalid email or password"}
Attempt 5: {"success":false,"message":"Invalid email or password"}
Attempt 6: {"success":false,"message":"Too many authentication attempts, please try again after 15 minutes."}
```

✅ **Success:** Blocks after 5 failed attempts  
❌ **Failure:** Allows unlimited attempts (SECURITY ISSUE!)

**Note:** Wait 15 minutes or restart server to reset rate limit.

---

### Test 20: Rate Limit Headers

Check rate limit information in response headers:

```bash
curl -i -X GET http://localhost:5000/api/accounts \
  -H "Authorization: Bearer $TOKEN" \
  | grep -i ratelimit
```

**Expected Output:**
```
RateLimit-Policy: 100;w=900
RateLimit-Limit: 100
RateLimit-Remaining: 92
RateLimit-Reset: 382
```

✅ **Success:** Headers present showing limits  
❌ **Failure:** No rate limit headers

---

## Testing Security

### Test 21: Security Headers

Check security headers are present:

```bash
curl -i http://localhost:5000/health | grep -i "x-\|strict"
```

**Expected Headers:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 0
```

✅ **Success:** Security headers present  
❌ **Failure:** Missing headers (security issue)

---

### Test 22: Request Without Token

Test protected endpoint without authentication:

```bash
curl -X GET http://localhost:5000/api/user/profile
```

**Expected Output:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**HTTP Status:** 401 Unauthorized

✅ **Success:** Returns 401 without token  
❌ **Failure:** Returns data without authentication (SECURITY ISSUE!)

---

### Test 23: Invalid Token

Test with invalid/expired token:

```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Output:**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**HTTP Status:** 401 Unauthorized

✅ **Success:** Returns 401 for invalid token  
❌ **Failure:** Crashes or returns data

---

## Troubleshooting

### Issue: Connection Refused

**Error:** `curl: (7) Failed to connect to localhost port 5000`

**Solution:**
1. Check if server is running: `npm run dev`
2. Check if port 5000 is available
3. Check `.env` file has correct PORT

---

### Issue: Database Connection Failed

**Error:** `❌ Failed to connect to database`

**Solution:**
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in `.env` is correct
3. Run migrations: `npx prisma migrate dev`
4. Seed database: `npx prisma db seed`

---

### Issue: Token Expired

**Error:** `{"success": false, "message": "Token expired"}`

**Solution:**
1. Login again to get new token
2. Tokens expire after 7 days by default

---

### Issue: Rate Limited

**Error:** `{"success": false, "message": "Too many requests..."}`

**Solution:**
1. Wait for rate limit window to reset (shown in RateLimit-Reset header)
2. Or restart server to clear in-memory rate limits

---

## Complete Test Script

Run all tests automatically:

```bash
#!/bin/bash

# Complete test script
echo "🧪 Testing Banking API"
echo "======================"

# Test 1: Health Check
echo "1. Health Check..."
curl -s http://localhost:5000/health | grep -q "ok" && echo "✅ PASS" || echo "❌ FAIL"

# Test 2: Login
echo "2. Login..."
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@demo.com", "password": "Demo123!"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ PASS - Token received"
else
  echo "❌ FAIL - No token"
  exit 1
fi

# Test 3: Get Profile
echo "3. Get Profile..."
curl -s -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer $TOKEN" | grep -q "success" && echo "✅ PASS" || echo "❌ FAIL"

# Test 4: Get Accounts
echo "4. Get Accounts..."
curl -s -X GET http://localhost:5000/api/accounts \
  -H "Authorization: Bearer $TOKEN" | grep -q "pagination" && echo "✅ PASS" || echo "❌ FAIL"

# Test 5: Get Summary
echo "5. Get Account Summary..."
curl -s -X GET http://localhost:5000/api/accounts/summary \
  -H "Authorization: Bearer $TOKEN" | grep -q "totalBalance" && echo "✅ PASS" || echo "❌ FAIL"

echo ""
echo "🎉 Tests complete!"
```

Save as `test-api.sh`, make executable, and run:

```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Next Steps

After manual testing:
1. ✅ All tests pass → Ready for automated testing
2. ❌ Tests fail → Debug issues before proceeding
3. Consider adding automated tests with Jest/Supertest

---

**Last Updated:** January 2025
