// DASHBOARD PAGE - Main User Dashboard
// Shows user's accounts, balance, and recent transactions

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { setProfile, setAccounts } from '../store/slices/userSlice';
import { RootState, AppDispatch } from '../store/store';
import { userAPI } from '../api/user.api';

// Account type
interface Account {
  id: string;
  accountNumber: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'CREDIT';
  balance: string;
  currency: string;
  isActive: boolean;
}

function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { profile, accounts } = useSelector((state: RootState) => state.user);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile
        const profileResponse = await userAPI.getProfile();
        dispatch(setProfile(profileResponse.data.data));
        
        // Fetch accounts
        const accountsResponse = await userAPI.getAccounts();
        dispatch(setAccounts(accountsResponse.data.data));
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dispatch]);
  
  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => {
    const balance = parseFloat(account.balance);
    // Subtract credit card balances (negative balance)
    return account.accountType === 'CREDIT' ? sum - balance : sum + balance;
  }, 0);
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  // Format currency
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };
  
  // Get account color
  const getAccountColor = (type: string) => {
    switch (type) {
      case 'CHECKING': return 'bg-blue-50';
      case 'SAVINGS': return 'bg-green-50';
      case 'CREDIT': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {profile?.firstName || 'User'}! Here's your account overview.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/cards"
              className="btn btn-secondary"
            >
              💳 My Cards
            </Link>
            <Link
              to="/profile"
              className="btn btn-secondary"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your accounts...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-semibold">Error</h3>
            <p className="mt-1">{error}</p>
          </div>
        )}
        
        {/* Success Message */}
        {!loading && !error && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
            <h3 className="font-semibold text-lg">🎉 Connected to Backend!</h3>
            <p className="mt-1">Displaying real data from your PostgreSQL database via the API you built.</p>
          </div>
        )}
        
        {/* Stats Cards */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Balance Card */}
              <div className="card">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Balance</h3>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
                <p className="mt-1 text-sm text-gray-500">Across {accounts.length} accounts</p>
              </div>
              
              {/* Accounts Card */}
              <div className="card">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Active Accounts</h3>
                <p className="text-3xl font-bold text-gray-900">{accounts.length}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {accounts.map(a => a.accountType.charAt(0) + a.accountType.slice(1).toLowerCase()).join(', ')}
                </p>
              </div>
              
              {/* User Info Card */}
              <div className="card">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Account Holder</h3>
                <p className="text-xl font-bold text-gray-900">
                  {profile?.firstName} {profile?.lastName}
                </p>
                <p className="mt-1 text-sm text-gray-500">{profile?.email}</p>
              </div>
            </div>
            
            {/* Accounts List */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Accounts</h2>
              
              {accounts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No accounts found</p>
              ) : (
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <Link
                      key={account.id}
                      to={`/account/${account.id}`}
                      className={`flex items-center justify-between p-4 ${getAccountColor(account.accountType)} rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()} Account
                        </h3>
                        <p className="text-sm text-gray-600">
                          Account ****{account.accountNumber.slice(-4)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {account.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${
                            account.accountType === 'CREDIT' ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {account.accountType === 'CREDIT' ? '-' : ''}{formatCurrency(account.balance)}
                          </p>
                          <p className="text-sm text-gray-500">{account.currency}</p>
                        </div>
                        <span className="text-gray-400 text-xl">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Next Steps */}
        {!loading && !error && (
          <div className="mt-8 card bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">✅ Full-Stack Connection!</h3>
            <p className="text-blue-700 mb-4">
              Your React frontend is now connected to your Express backend! You're displaying:
            </p>
            <ul className="list-disc list-inside space-y-1 text-blue-700 mb-4">
              <li>✅ Real user profile from PostgreSQL database</li>
              <li>✅ Actual account balances from backend API</li>
              <li>✅ Calculated total balance across all accounts</li>
              <li>✅ Protected routes with JWT authentication</li>
              <li>👉 Click any account to view transactions!</li>
            </ul>
            <p className="text-blue-700 font-medium">
              Try it: Click on any account card above to see transaction history with filtering!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;

// WHAT'S NOW WORKING:
// ✅ Protected route (must be logged in)
// ✅ Fetches real user profile from backend
// ✅ Fetches real accounts from backend
// ✅ Displays actual balances from database
// ✅ Calculates total balance across accounts
// ✅ Shows user name in header
// ✅ Beautiful UI with loading states
// ✅ Error handling
// ✅ Logout functionality
// ✅ Full-stack connection complete!
//
// DATA FLOW:
// 1. Dashboard mounts
// 2. useEffect fires
// 3. Calls userAPI.getProfile() → GET /api/user/profile
// 4. Calls userAPI.getAccounts() → GET /api/accounts
// 5. Backend returns data from PostgreSQL
// 6. Redux state updated
// 7. Component re-renders with real data
//
// NEXT FEATURES:
// - View transaction history
// - Filter transactions by date/type
// - Edit user profile
// - Change password
// - Account detail pages
