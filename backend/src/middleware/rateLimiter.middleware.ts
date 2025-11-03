// RATE LIMITER MIDDLEWARE - Prevents API Abuse
// This limits how many requests a user can make in a time window
// Think of it as: A bouncer counting how many times someone enters

import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

// ============================================
// GENERAL API RATE LIMITER
// Applies to all routes (unless overridden)
// ============================================

export const generalLimiter = rateLimit({
  // Time window: 15 minutes
  windowMs: env.rateLimit.windowMs, // From .env (900000ms = 15 min)
  
  // Max requests per window
  max: env.rateLimit.max, // From .env (100 requests)
  
  // Message when limit exceeded
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  
  // Use IP address to track requests
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  
  // Custom key generator (uses IP address)
  // In production, you might want to use user ID for authenticated routes
  keyGenerator: (req) => {
    // Handle both IPv4 and IPv6 addresses
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    // Normalize IPv6-mapped IPv4 addresses
    return ip.replace(/^::ffff:/, '');
  },
});

// ============================================
// STRICT LIMITER FOR AUTH ENDPOINTS
// Login/Register are more sensitive (prevent brute force)
// ============================================

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests (only count failed ones)
  skipSuccessfulRequests: true,
});

// ============================================
// PASSWORD RESET LIMITER
// Even stricter for password changes
// ============================================

export const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 password change attempts per hour
  message: {
    success: false,
    message: 'Too many password change attempts, please try again after 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// HOW RATE LIMITING WORKS:
// ============================================
//
// EXAMPLE: General Limiter (100 requests / 15 min)
//
// User makes requests:
// Request 1-99:   ✅ Allowed
// Request 100:    ✅ Allowed (limit reached)
// Request 101:    ❌ Blocked (429 Too Many Requests)
// ... 15 minutes pass ...
// Request 102:    ✅ Allowed (counter reset)
//
// EXAMPLE: Auth Limiter (5 requests / 15 min)
//
// Failed login attempts:
// Attempt 1: Wrong password ❌ (counter: 1)
// Attempt 2: Wrong password ❌ (counter: 2)
// Attempt 3: Wrong password ❌ (counter: 3)
// Attempt 4: Wrong password ❌ (counter: 4)
// Attempt 5: Wrong password ❌ (counter: 5, limit reached)
// Attempt 6: ❌ BLOCKED for 15 minutes!
//
// Successful login:
// Attempt 3: Correct password ✅ (counter: 2, not incremented!)
//
// WHY RATE LIMITING?
//
// 1. **Prevent Brute Force Attacks**
//    - Attacker tries 1000s of passwords
//    - Rate limit blocks them after 5 attempts
//
// 2. **Prevent DoS (Denial of Service)**
//    - Attacker floods server with requests
//    - Rate limit stops them from overwhelming server
//
// 3. **Protect Resources**
//    - Database queries cost money/resources
//    - Limit prevents abuse
//
// 4. **Fair Usage**
//    - Prevents one user from hogging all resources
//    - Everyone gets fair access
//
// HEADERS RETURNED:
//
// RateLimit-Limit: 100
// RateLimit-Remaining: 47
// RateLimit-Reset: 1635724800
//
// Client can see:
// - How many requests allowed (100)
// - How many remaining (47)
// - When limit resets (Unix timestamp)
//
// PRODUCTION TIPS:
//
// 1. Store in Redis (not memory)
//    - Memory resets when server restarts
//    - Redis persists across restarts
//    - Redis works with multiple servers
//
// 2. Different limits for different users
//    - Free tier: 100 requests/hour
//    - Premium tier: 1000 requests/hour
//
// 3. Use userId instead of IP for authenticated routes
//    - More accurate (one user, multiple IPs)
//    - Can't bypass by changing IP
//
// 4. Whitelist trusted IPs
//    - Don't rate limit your own monitoring
//    - Don't rate limit admin users
