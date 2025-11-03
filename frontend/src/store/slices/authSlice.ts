// AUTH SLICE - Authentication State Management
// Handles login, logout, and authentication status

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../api/auth.api';

// Define the shape of auth state
interface AuthState {
  token: string | null;           // JWT token
  isAuthenticated: boolean;       // Is user logged in?
  loading: boolean;               // Is auth operation in progress?
  error: string | null;           // Error message if any
}

// Initial state
const initialState: AuthState = {
  token: localStorage.getItem('token'), // Load token from localStorage
  isAuthenticated: !!localStorage.getItem('token'), // True if token exists
  loading: false,
  error: null,
};

// ASYNC ACTIONS - Call API and update state

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      // Backend returns: { data: { token: "...", user: {...} } }
      // Axios wraps it: response.data = backend response
      const token = response.data.data.token;
      // Save token to localStorage
      localStorage.setItem('token', token);
      return response.data.data; // Return { token, user }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Register action
export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.register(userData);
      // Backend returns: { data: { token: "...", user: {...} } }
      const token = response.data.data.token;
      // Save token to localStorage
      localStorage.setItem('token', token);
      return response.data.data; // Return { token, user }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout action (synchronous)
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token'); // Remove token from storage
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.error = action.payload as string;
    });

    // REGISTER
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.error = action.payload as string;
    });
  },
});

// Export actions
export const { logout, clearError } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// HOW THIS WORKS:
//
// LOGIN FLOW:
// 1. Component calls: dispatch(login({ email, password }))
// 2. createAsyncThunk calls authAPI.login()
// 3. API returns token
// 4. Save token to localStorage
// 5. State updated: isAuthenticated = true
// 6. Component re-renders (user is logged in)
//
// STATE CHANGES:
// login.pending  → loading = true
// login.fulfilled → isAuthenticated = true, token saved
// login.rejected  → error message set
//
// LOGOUT FLOW:
// 1. Component calls: dispatch(logout())
// 2. Token removed from localStorage
// 3. State reset to logged out
// 4. Component re-renders (user logged out)
//
// WHY localStorage?
// - Persist login across page refreshes
// - User stays logged in even if they close browser
// - Token loaded on app start (initialState)
