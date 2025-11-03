// LOGIN PAGE - User Authentication
// This page allows users to log in to their account

import { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store/store';

function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent page reload
    
    try {
      // Dispatch login action
      const result = await dispatch(login({ email, password })).unwrap();
      
      // If login successful, navigate to dashboard
      console.log('Login successful:', result);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by Redux slice
      console.error('Login failed:', err);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="user@demo.com"
                disabled={loading}
              />
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-1">Demo Account:</p>
            <p className="text-sm text-blue-700">
              Email: <span className="font-mono">user@demo.com</span><br />
              Password: <span className="font-mono">Demo123!</span>
            </p>
          </div>
          
          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

// HOW THIS WORKS:
//
// FORM FLOW:
// 1. User enters email and password
// 2. User clicks "Sign In"
// 3. handleSubmit() prevents page reload
// 4. dispatch(login()) sends credentials to backend
// 5. Backend validates and returns token
// 6. Redux saves token to localStorage
// 7. Redux updates: isAuthenticated = true
// 8. navigate('/dashboard') redirects user
// 9. ProtectedRoute sees authenticated
// 10. Dashboard shows!
//
// ERROR HANDLING:
// If login fails:
// - Redux sets error message
// - Red alert box shows error
// - User can try again
//
// LOADING STATE:
// While logging in:
// - Button shows "Signing in..."
// - Inputs are disabled
// - Can't submit multiple times
//
// DEMO ACCOUNT:
// Blue box shows credentials to make testing easy!
