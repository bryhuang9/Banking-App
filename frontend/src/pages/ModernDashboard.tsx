// MODERN DASHBOARD - Redesigned with Creative UI
// Beautiful gradient backgrounds, glassmorphism, smooth animations

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { setProfile, setAccounts } from '../store/slices/userSlice';
import { RootState, AppDispatch } from '../store/store';
import { userAPI } from '../api/user.api';

interface Account {
  id: string;
  accountNumber: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'CREDIT';
  balance: string;
  currency: string;
  isActive: boolean;
}

function ModernDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { profile, accounts } = useSelector((state: RootState) => state.user);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileResponse, accountsResponse] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getAccounts(),
      ]);
      
      dispatch(setProfile(profileResponse.data.data));
      dispatch(setAccounts(accountsResponse.data.data));
      setLoading(false);
    } catch (err: any) {
      console.error('Error:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const totalBalance = accounts.reduce((sum, account) => {
    const balance = parseFloat(account.balance);
    return sum + balance;
  }, 0);
  
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };
  
  const getAccountGradient = (type: string) => {
    switch (type) {
      case 'CHECKING':
        return 'from-blue-500 to-cyan-500';
      case 'SAVINGS':
        return 'from-green-500 to-emerald-500';
      case 'CREDIT':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };
  
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'CHECKING':
        return '💳';
      case 'SAVINGS':
        return '🏦';
      case 'CREDIT':
        return '💎';
      default:
        return '💰';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Modern Navigation Bar */}
      <nav className="relative bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                BankFlow
              </h1>
              <div className="hidden md:flex space-x-1">
                <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold">
                  Dashboard
                </Link>
                <Link to="/transfers" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition">
                  Transfers
                </Link>
                <Link to="/cards" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition">
                  Cards
                </Link>
                <Link to="/profile" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition">
                  Profile
                </Link>
              </div>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading your finances...</p>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div className="mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{profile?.firstName}!</span>
              </h2>
              <p className="text-gray-600 text-lg">Here's what's happening with your money today.</p>
            </div>
            
            {/* Total Balance Card - Hero */}
            <div className="mb-8 relative">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative z-10">
                  <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">Total Balance</p>
                  <p className="text-5xl md:text-6xl font-black mb-4">{formatCurrency(totalBalance)}</p>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                      {accounts.length} Active Accounts
                    </span>
                    <span className="px-3 py-1 bg-green-400/30 backdrop-blur-sm rounded-full text-sm font-semibold">
                      +2.5% this month
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Link to="/transfers" className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-white/20">
                <div className="text-4xl mb-2">💸</div>
                <p className="font-bold text-gray-900">Send Money</p>
                <p className="text-xs text-gray-600">Transfer funds</p>
              </Link>
              
              <Link to="/transfers" className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-white/20">
                <div className="text-4xl mb-2">💰</div>
                <p className="font-bold text-gray-900">Deposit</p>
                <p className="text-xs text-gray-600">Add funds</p>
              </Link>
              
              <Link to="/cards" className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-white/20">
                <div className="text-4xl mb-2">💳</div>
                <p className="font-bold text-gray-900">Cards</p>
                <p className="text-xs text-gray-600">Manage cards</p>
              </Link>
              
              <Link to="/profile" className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-white/20">
                <div className="text-4xl mb-2">⚙️</div>
                <p className="font-bold text-gray-900">Settings</p>
                <p className="text-xs text-gray-600">Your profile</p>
              </Link>
            </div>
            
            {/* Accounts Grid */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Accounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <Link
                    key={account.id}
                    to={`/account/${account.id}`}
                    className="group"
                  >
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-white/20 relative overflow-hidden">
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${getAccountGradient(account.accountType)} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-3xl mb-2">{getAccountIcon(account.accountType)}</p>
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              {account.accountType}
                            </p>
                            <p className="text-xs text-gray-500">•••• {account.accountNumber.slice(-4)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            account.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {account.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-3xl font-black text-gray-900">
                            {formatCurrency(account.balance)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {account.currency}
                            {account.accountType === 'CREDIT' && parseFloat(account.balance) < 0 && ' • Amount Owed'}
                            {account.accountType === 'CREDIT' && parseFloat(account.balance) > 0 && ' • Credit Balance'}
                          </p>
                        </div>
                        
                        <div className="mt-4 flex items-center text-indigo-600 group-hover:text-indigo-700 font-semibold text-sm">
                          View Details
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Bottom CTA */}
            <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
              <p className="text-white/80 mb-4">Our support team is here 24/7 to assist you.</p>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:shadow-lg transition-all">
                Contact Support
              </button>
            </div>
          </>
        )}
      </main>
      
      {/* Custom CSS for Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default ModernDashboard;
