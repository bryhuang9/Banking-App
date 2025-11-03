// REDUX STORE - Central State Management
// This is the single source of truth for all app state

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,   // Authentication state (token, isAuthenticated)
    user: userReducer,   // User data (profile, accounts)
  },
  // Middleware for dev tools and debugging
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// HOW REDUX WORKS:
//
// State Flow:
// Component → Dispatch Action → Reducer → Update State → Component Re-renders
//
// Example:
// LoginPage → dispatch(login()) → authSlice → state.auth updated → App sees change
//
// WHY REDUX?
// - Single source of truth (one store for all state)
// - Predictable state changes (only through actions)
// - Easy debugging (see all state changes)
// - Time-travel debugging
// - Works across all components
//
// STATE STRUCTURE:
// {
//   auth: {
//     token: "jwt_token",
//     isAuthenticated: true,
//     loading: false,
//     error: null
//   },
//   user: {
//     profile: { id, email, firstName, ... },
//     accounts: [ { id, balance, ... }, ... ],
//     loading: false,
//     error: null
//   }
// }
