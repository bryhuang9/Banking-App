// REQUEST LOGGER MIDDLEWARE - Tracks All Requests
// This logs every request to the console for debugging and monitoring
// Think of it as: Security camera recording everything

import morgan from 'morgan';
import { env } from '../config/env';

// ============================================
// CUSTOM TOKEN - Add userId to logs
// ============================================

// Create a custom token that extracts userId from request
morgan.token('user-id', (req: any) => {
  // If user is authenticated, show their ID
  return req.user?.userId || 'anonymous';
});

// ============================================
// LOG FORMAT FOR DEVELOPMENT
// More detailed, easier to read
// ============================================

const developmentFormat = [
  ':method',        // HTTP method (GET, POST, etc.)
  ':url',           // Request URL
  ':status',        // Response status code
  ':response-time ms', // How long request took
  '- :user-id',     // Who made the request
].join(' ');

// Example output:
// GET /api/accounts 200 45.3 ms - abc-123-user-id
// POST /api/auth/login 401 12.5 ms - anonymous

// ============================================
// LOG FORMAT FOR PRODUCTION
// Compact, structured for log aggregation tools
// ============================================

const productionFormat = [
  ':remote-addr',   // Client IP address
  ':method',        // HTTP method
  ':url',           // Request URL
  ':status',        // Response status
  ':response-time', // Response time
  ':user-id',       // User ID
  '":user-agent"',  // Browser/client info
].join(' ');

// Example output:
// 192.168.1.1 GET /api/accounts 200 45 abc-123 "Mozilla/5.0..."

// ============================================
// EXPORT LOGGER BASED ON ENVIRONMENT
// ============================================

export const requestLogger = morgan(
  env.isDevelopment ? developmentFormat : productionFormat,
  {
    // Skip logging for certain conditions
    skip: (req: any, res: any) => {
      // Don't log health checks (they happen too frequently)
      if (req.url === '/health') return true;
      
      // In production, only log errors and warnings
      if (env.isProduction && res.statusCode < 400) return true;
      
      return false;
    },
    
    // Add custom stream for production (could write to file)
    stream: {
      write: (message: string) => {
        // In production, you'd send to logging service (CloudWatch, Datadog, etc.)
        // For now, just console.log
        console.log(message.trim());
      },
    },
  }
);

// ============================================
// HOW REQUEST LOGGING WORKS:
// ============================================
//
// FLOW:
// 1. Request arrives
// 2. Logger middleware runs FIRST
// 3. Logs request details
// 4. Passes to next middleware
// 5. When response sent, logs response details
//
// EXAMPLE DEVELOPMENT LOGS:
//
// POST /api/auth/login 200 45.3 ms - anonymous
// ↑     ↑               ↑   ↑         ↑
// |     |               |   |         User not logged in yet
// |     |               |   Response time
// |     |               Success!
// |     Login endpoint
// POST request
//
// GET /api/accounts 200 12.5 ms - abc-123-def
// ↑   ↑             ↑   ↑         ↑
// |   |             |   |         User ID (authenticated)
// |   |             |   Fast response!
// |   |             Success
// |   Accounts list
// GET request
//
// GET /api/accounts/xyz 403 8.2 ms - abc-123-def
// ↑   ↑                  ↑   ↑        ↑
// |   |                  |   |        User ID
// |   |                  |   Very fast
// |   |                  Forbidden (tried to access someone else's account)
// |   Account detail
// GET request
//
// WHY LOGGING?
//
// 1. **Debugging**
//    - See what requests are failing
//    - Track down bugs faster
//    - "User says account page is broken" → Check logs
//
// 2. **Monitoring**
//    - Which endpoints are most used?
//    - Which are slowest?
//    - Any errors happening?
//
// 3. **Security**
//    - Detect suspicious activity
//    - Track failed login attempts
//    - See if someone is trying to access others' data
//
// 4. **Analytics**
//    - How many API calls per day?
//    - Which features are popular?
//    - Performance over time
//
// PRODUCTION IMPROVEMENTS:
//
// 1. **Send to logging service**
//    - CloudWatch (AWS)
//    - Datadog
//    - LogRocket
//    - Sentry
//
// 2. **Structure as JSON**
//    ```json
//    {
//      "timestamp": "2025-01-15T10:30:00Z",
//      "method": "GET",
//      "url": "/api/accounts",
//      "status": 200,
//      "responseTime": 45,
//      "userId": "abc-123",
//      "ip": "192.168.1.1"
//    }
//    ```
//
// 3. **Add correlation IDs**
//    - Track a request through multiple services
//    - Easier to debug complex flows
//
// 4. **Filter sensitive data**
//    - Don't log passwords!
//    - Don't log credit card numbers!
//    - Redact sensitive fields
//
// 5. **Log levels**
//    - INFO: Normal operations
//    - WARN: Something unusual
//    - ERROR: Something broke
//    - DEBUG: Detailed debugging info
//
// WHAT NOT TO LOG:
//
// ❌ Passwords (even hashed)
// ❌ API keys
// ❌ Credit card numbers
// ❌ Social security numbers
// ❌ Personal health information
// ✅ User IDs (not personal data)
// ✅ Request URLs
// ✅ Response status codes
// ✅ Response times
