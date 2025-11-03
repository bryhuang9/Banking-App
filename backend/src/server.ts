// SERVER - The Start Button
// This file starts the Express server and connects to the database
// Think of it as turning on the lights and opening the restaurant doors

import app from './app'; // The Express app we set up
import { env } from './config/env'; // Environment variables
import { connectDatabase } from './config/database'; // Database connection

// START SERVER FUNCTION
// This is async because we need to wait for database connection
async function startServer() {
  try {
    // STEP 1: Connect to PostgreSQL database
    // This tests the connection and makes sure database is reachable
    await connectDatabase();
    // You'll see: "✅ Database connected successfully"

    // STEP 2: Start listening for HTTP requests
    // app.listen() starts the web server on specified port
    app.listen(env.port, () => {
      // This callback runs once server is ready
      console.log(`🚀 Server running on http://localhost:${env.port}`);
      console.log(`📝 Environment: ${env.nodeEnv}`);
      console.log(`\n📍 API Endpoints:`);
      console.log(`   GET  http://localhost:${env.port}/health`);
      console.log(`\n   Authentication:`);
      console.log(`   POST http://localhost:${env.port}/api/auth/register`);
      console.log(`   POST http://localhost:${env.port}/api/auth/login`);
      console.log(`   GET  http://localhost:${env.port}/api/auth/me (protected)`);
      console.log(`   POST http://localhost:${env.port}/api/auth/logout (protected)`);
      console.log(`\n   User Profile:`);
      console.log(`   GET  http://localhost:${env.port}/api/user/profile (protected)`);
      console.log(`   PUT  http://localhost:${env.port}/api/user/profile (protected)`);
      console.log(`   PUT  http://localhost:${env.port}/api/user/password (protected)`);
      console.log(`\n   Accounts & Transactions:`);
      console.log(`   GET  http://localhost:${env.port}/api/accounts (protected)`);
      console.log(`   GET  http://localhost:${env.port}/api/accounts/summary (protected)`);
      console.log(`   GET  http://localhost:${env.port}/api/accounts/:id (protected)`);
      console.log(`   GET  http://localhost:${env.port}/api/accounts/:id/transactions (protected)`);
      console.log(`\n✨ Press Ctrl+C to stop the server\n`);
    });

  } catch (error) {
    // If something goes wrong during startup, log it and exit
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Exit with error code 1
    // Why exit? If database connection fails, the server shouldn't run
  }
}

// Actually start the server
// This calls the function above
startServer();

// WHAT HAPPENS WHEN YOU RUN `npm run dev`:
//
// 1. Node.js runs this file (server.ts)
// 2. Imports load (app, env, connectDatabase)
// 3. startServer() is called
// 4. Tries to connect to database
//    - If fails → error message, server exits
//    - If success → continues
// 5. Starts Express server on port 5000
// 6. Console shows "🚀 Server running..."
// 7. Server is now listening for requests!
//
// Now you can test with:
// - Browser: http://localhost:5000/health
// - curl: curl http://localhost:5000/health
// - Postman: GET http://localhost:5000/health
//
// To stop the server:
// - Press Ctrl+C in terminal
//
// COMMON ERRORS:
//
// "Port 5000 already in use"
// → Another process is using port 5000
// → Solution: Change PORT in .env or kill other process
//
// "Database connection failed"
// → PostgreSQL not running or wrong credentials
// → Solution: Start PostgreSQL, check DATABASE_URL in .env
//
// "Cannot find module"
// → Missing dependency
// → Solution: npm install
