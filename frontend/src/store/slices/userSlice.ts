// USER SLICE - User Data State Management
// Handles user profile and accounts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define user profile type
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Define account type
interface Account {
  id: string;
  accountNumber: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'CREDIT';
  balance: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define user state
interface UserState {
  profile: UserProfile | null;
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  profile: null,
  accounts: [],
  loading: false,
  error: null,
};

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user profile
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    
    // Set accounts
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Clear user data (on logout)
    clearUser: (state) => {
      state.profile = null;
      state.accounts = [];
      state.error = null;
    },
  },
});

// Export actions
export const { setProfile, setAccounts, setLoading, setError, clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// HOW TO USE:
//
// In a component:
// import { useDispatch } from 'react-redux';
// import { setProfile } from '../store/slices/userSlice';
//
// const dispatch = useDispatch();
// dispatch(setProfile(userData));
//
// To access state:
// import { useSelector } from 'react-redux';
// const profile = useSelector((state: RootState) => state.user.profile);
