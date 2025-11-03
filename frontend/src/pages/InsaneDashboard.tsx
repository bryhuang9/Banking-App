// INSANE DASHBOARD - Dark Neon Theme with Crazy Animations!

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

function InsaneDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { profile, accounts } = useSelector((state: RootState) => state.user);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [accounts]);
  
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
      const accountsData = accountsResponse.data?.data || accountsResponse.data || [];
      dispatch(setAccounts(accountsData));
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
        return 'from-blue-600 via-cyan-500 to-teal-400';
      case 'SAVINGS':
        return 'from-green-600 via-emerald-500 to-lime-400';
      case 'CREDIT':
        return 'from-purple-600 via-pink-500 to-rose-400';
      default:
        return 'from-gray-600 via-gray-500 to-gray-400';
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden pb-20">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
      
      {/* Animated Grid */}
      <div className="fixed inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        ></div>
      </div>
      
      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Nav */}
      <nav className="relative bg-black/50 backdrop-blur-xl border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                BankFlow
              </Link>
              <div className="hidden md:flex space-x-1">
                <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/50">Dashboard</Link>
                <Link to="/transfers" className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition">Transfers</Link>
                <Link to="/cards" className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition">Cards</Link>
                <Link to="/profile" className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition">Profile</Link>
              </div>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 transition">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block relative">
              <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="mt-8 text-2xl text-gray-400 font-semibold animate-pulse">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div 
              className="mb-12 scroll-reveal opacity-0 translate-y-20"
              style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
            >
              <h1 className="text-6xl md:text-8xl font-black mb-4 leading-none">
                <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Welcome back,
                </span>
              </h1>
              <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {profile?.firstName}!
              </h2>
              <p className="text-xl text-gray-400 mt-4">Manage your finances with style</p>
            </div>
            
            {/* Total Balance Card */}
            <div className="mb-12 scroll-reveal opacity-0 translate-y-20">
              <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl p-10 shadow-2xl shadow-purple-500/50 overflow-hidden group hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <p className="text-white/80 text-sm font-black uppercase tracking-wider mb-2">Total Balance</p>
                  <p className="text-6xl md:text-7xl font-black mb-4">{formatCurrency(totalBalance)}</p>
                  <div className="flex items-center space-x-3">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-bold">
                      {accounts.length} Active Accounts
                    </span>
                    <span className="px-4 py-2 bg-green-400/30 backdrop-blur-sm rounded-full font-bold">
                      +2.5% this month
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { icon: '💸', title: 'Send Money', subtitle: 'Transfer funds', link: '/transfers' },
                { icon: '💰', title: 'Deposit', subtitle: 'Add funds', link: '/transfers' },
                { icon: '💳', title: 'Cards', subtitle: 'Manage cards', link: '/cards' },
                { icon: '⚙️', title: 'Settings', subtitle: 'Your profile', link: '/profile' },
              ].map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="scroll-reveal opacity-0 translate-y-20 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-110 hover:-translate-y-2 duration-300 shadow-lg hover:shadow-purple-500/50">
                    <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">{action.icon}</div>
                    <p className="font-black text-xl text-white mb-1">{action.title}</p>
                    <p className="text-sm text-gray-400">{action.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Accounts Grid */}
            <div>
              <h3 className="text-3xl font-black text-white mb-6 scroll-reveal opacity-0 translate-y-20">Your Accounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {accounts.map((account, index) => (
                  <Link
                    key={account.id}
                    to={`/account/${account.id}`}
                    className="scroll-reveal opacity-0 translate-y-20 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`relative bg-gradient-to-br ${getAccountGradient(account.accountType)} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-2 overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-5xl mb-2">{getAccountIcon(account.accountType)}</p>
                            <p className="text-sm font-black uppercase tracking-wider opacity-75">{account.accountType}</p>
                            <p className="text-xs opacity-75">•••• {account.accountNumber.slice(-4)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${
                            account.isActive ? 'bg-green-400 text-green-900' : 'bg-gray-400 text-gray-900'
                          }`}>
                            {account.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-4xl font-black mb-1">
                            {formatCurrency(account.balance)}
                          </p>
                          <p className="text-xs opacity-75">
                            {account.currency}
                            {account.accountType === 'CREDIT' && parseFloat(account.balance) < 0 && ' • Amount Owed'}
                            {account.accountType === 'CREDIT' && parseFloat(account.balance) > 0 && ' • Credit Balance'}
                          </p>
                        </div>
                        
                        <div className="mt-4 flex items-center text-white font-bold text-sm">
                          View Details
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .scroll-reveal {
          transition: all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1);
        }
        
        .scroll-reveal.animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}

export default InsaneDashboard;
