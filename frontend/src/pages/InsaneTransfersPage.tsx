// INSANE TRANSFERS PAGE - Dark Neon Theme with Animations!

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { userAPI } from '../api/user.api';
import axios from '../api/axios.config';

interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: string;
  currency: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: string;
  description: string;
  status: string;
  transactionDate: string;
}

function InsaneTransfersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const [activeTab, setActiveTab] = useState<'transfer' | 'deposit' | 'withdraw'>('transfer');
  
  const [transferForm, setTransferForm] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    amount: '',
    description: '',
  });
  
  const [depositForm, setDepositForm] = useState({
    accountId: '',
    amount: '',
    description: '',
  });
  
  const [withdrawForm, setWithdrawForm] = useState({
    accountId: '',
    amount: '',
    description: '',
  });
  
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
      const accountsResponse = await userAPI.getAccounts();
      const accountsData = accountsResponse.data?.data || accountsResponse.data || [];
      setAccounts(accountsData);
      
      if (accountsData.length > 0) {
        try {
          const transResponse = await userAPI.getTransactions(accountsData[0].id, { limit: 10 });
          const transData = transResponse.data?.data || transResponse.data || [];
          setTransactions(transData);
        } catch {
          setTransactions([]);
        }
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };
  
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProcessing(true);
      setError(null);
      
      await axios.post('/api/transfers', {
        fromAccountId: transferForm.fromAccountId,
        toAccountNumber: transferForm.toAccountNumber,
        amount: parseFloat(transferForm.amount),
        description: transferForm.description || 'Transfer',
      });
      
      setSuccess('Transfer completed successfully! 💸');
      setTransferForm({ fromAccountId: '', toAccountNumber: '', amount: '', description: '' });
      await fetchData();
      setProcessing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed');
      setProcessing(false);
    }
  };
  
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProcessing(true);
      setError(null);
      
      await axios.post('/api/transactions/deposit', {
        accountId: depositForm.accountId,
        amount: parseFloat(depositForm.amount),
        description: depositForm.description || 'Deposit',
      });
      
      setSuccess('Deposit completed successfully! 💰');
      setDepositForm({ accountId: '', amount: '', description: '' });
      await fetchData();
      setProcessing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Deposit failed');
      setProcessing(false);
    }
  };
  
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProcessing(true);
      setError(null);
      
      await axios.post('/api/transactions/withdraw', {
        accountId: withdrawForm.accountId,
        amount: parseFloat(withdrawForm.amount),
        description: withdrawForm.description || 'Withdrawal',
      });
      
      setSuccess('Withdrawal completed successfully! 🏧');
      setWithdrawForm({ accountId: '', amount: '', description: '' });
      await fetchData();
      setProcessing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Withdrawal failed');
      setProcessing(false);
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
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
        {[...Array(20)].map((_, i) => (
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
                <Link to="/dashboard" className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition">Dashboard</Link>
                <Link to="/transfers" className="px-4 py-2 rounded-lg bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/50">Transfers</Link>
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
        {/* Hero */}
        <div 
          className="mb-12 scroll-reveal opacity-0 translate-y-20"
          style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-4 leading-none">
            <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Transfers
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400">
            Send money, deposit, or withdraw funds
          </p>
        </div>
        
        {/* Messages */}
        {success && (
          <div className="mb-8 bg-green-500/20 border-2 border-green-400/50 text-green-300 px-8 py-5 rounded-2xl shadow-2xl shadow-green-500/20 backdrop-blur-xl animate-bounce">
            <span className="font-bold text-lg">{success}</span>
          </div>
        )}
        
        {error && (
          <div className="mb-8 bg-red-500/20 border-2 border-red-400/50 text-red-300 px-8 py-5 rounded-2xl shadow-2xl shadow-red-500/20 backdrop-blur-xl">
            <span className="font-bold text-lg">{error}</span>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block relative">
              <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-8 text-2xl text-gray-400 font-semibold animate-pulse">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Transaction Forms */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 scroll-reveal opacity-0 translate-y-20">
                {/* Tabs */}
                <div className="flex space-x-2 mb-8 bg-black/30 p-2 rounded-2xl">
                  <button
                    onClick={() => setActiveTab('transfer')}
                    className={`flex-1 py-4 px-6 rounded-xl font-black transition-all ${
                      activeTab === 'transfer'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl mr-2">💸</span>
                    Transfer
                  </button>
                  <button
                    onClick={() => setActiveTab('deposit')}
                    className={`flex-1 py-4 px-6 rounded-xl font-black transition-all ${
                      activeTab === 'deposit'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl mr-2">💰</span>
                    Deposit
                  </button>
                  <button
                    onClick={() => setActiveTab('withdraw')}
                    className={`flex-1 py-4 px-6 rounded-xl font-black transition-all ${
                      activeTab === 'withdraw'
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl mr-2">🏧</span>
                    Withdraw
                  </button>
                </div>
                
                {/* Forms */}
                {activeTab === 'transfer' && (
                  <form onSubmit={handleTransfer} className="space-y-6">
                    <div>
                      <label className="block text-sm font-black text-purple-300 mb-2 uppercase">From Account</label>
                      <select
                        value={transferForm.fromAccountId}
                        onChange={(e) => setTransferForm({ ...transferForm, fromAccountId: e.target.value })}
                        className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-purple-500/30 focus:border-purple-500 text-white font-bold"
                        required
                      >
                        <option value="">Select account</option>
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.accountType} •••• {acc.accountNumber.slice(-4)} - {formatCurrency(acc.balance)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-purple-300 mb-2 uppercase">To Account Number</label>
                      <input
                        type="text"
                        value={transferForm.toAccountNumber}
                        onChange={(e) => setTransferForm({ ...transferForm, toAccountNumber: e.target.value })}
                        className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-purple-500/30 focus:border-purple-500 text-white font-bold"
                        placeholder="Enter account number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-purple-300 mb-2 uppercase">Amount</label>
                      <input
                        type="number"
                        value={transferForm.amount}
                        onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                        className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-purple-500/30 focus:border-purple-500 text-white font-bold"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-purple-300 mb-2 uppercase">Description</label>
                      <input
                        type="text"
                        value={transferForm.description}
                        onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                        className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-purple-500/30 focus:border-purple-500 text-white font-bold"
                        placeholder="What's this for?"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-black hover:scale-105 transition-all disabled:opacity-50 shadow-lg"
                    >
                      {processing ? 'Processing...' : 'Send Money'}
                    </button>
                  </form>
                )}
                
                {activeTab === 'deposit' && (
                  <form onSubmit={handleDeposit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-black text-green-300 mb-2 uppercase">To Account</label>
                      <select
                        value={depositForm.accountId}
                        onChange={(e) => setDepositForm({ ...depositForm, accountId: e.target.value })}
                        className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-green-500/30 focus:border-green-500 text-white font-bold"
                        required
                      >
                        <option value="">Select account</option>
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.accountType} •••• {acc.accountNumber.slice(-4)} - {formatCurrency(acc.balance)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-green-300 mb-2 uppercase">Amount</label>
                      <input
                        type="number"
                        value={depositForm.amount}
                        onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                        className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-green-500/30 focus:border-green-500 text-white font-bold"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-green-300 mb-2 uppercase">Description</label>
                      <input
                        type="text"
                        value={depositForm.description}
                        onChange={(e) => setDepositForm({ ...depositForm, description: e.target.value })}
                        className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-green-500/30 focus:border-green-500 text-white font-bold"
                        placeholder="Source of deposit"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-black hover:scale-105 transition-all disabled:opacity-50 shadow-lg"
                    >
                      {processing ? 'Processing...' : 'Deposit Money'}
                    </button>
                  </form>
                )}
                
                {activeTab === 'withdraw' && (
                  <form onSubmit={handleWithdraw} className="space-y-6">
                    <div>
                      <label className="block text-sm font-black text-red-300 mb-2 uppercase">From Account</label>
                      <select
                        value={withdrawForm.accountId}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, accountId: e.target.value })}
                        className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-red-500/30 focus:border-red-500 text-white font-bold"
                        required
                      >
                        <option value="">Select account</option>
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.accountType} •••• {acc.accountNumber.slice(-4)} - {formatCurrency(acc.balance)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-red-300 mb-2 uppercase">Amount</label>
                      <input
                        type="number"
                        value={withdrawForm.amount}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                        className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-red-500/30 focus:border-red-500 text-white font-bold"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-red-300 mb-2 uppercase">Description</label>
                      <input
                        type="text"
                        value={withdrawForm.description}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, description: e.target.value })}
                        className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-red-500/30 focus:border-red-500 text-white font-bold"
                        placeholder="Purpose of withdrawal"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl font-black hover:scale-105 transition-all disabled:opacity-50 shadow-lg"
                    >
                      {processing ? 'Processing...' : 'Withdraw Money'}
                    </button>
                  </form>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Balances */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20 scroll-reveal opacity-0 translate-y-20">
                <h3 className="text-xl font-black text-white mb-4">Your Accounts</h3>
                <div className="space-y-3">
                  {accounts.map((acc) => (
                    <div key={acc.id} className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-purple-500/20">
                      <p className="text-sm text-gray-400 font-bold">{acc.accountType}</p>
                      <p className="text-xs text-gray-500">•••• {acc.accountNumber.slice(-4)}</p>
                      <p className="text-2xl font-black text-white mt-2">{formatCurrency(acc.balance)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recent Activity */}
              {transactions.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20 scroll-reveal opacity-0 translate-y-20">
                  <h3 className="text-xl font-black text-white mb-4">Recent Activity</h3>
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((txn) => (
                      <div key={txn.id} className="p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-sm font-bold text-white">{txn.description}</p>
                        <p className="text-xs text-gray-500">{new Date(txn.transactionDate).toLocaleDateString()}</p>
                        <p className={`font-black mt-1 ${
                          txn.type === 'DEPOSIT' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {txn.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(txn.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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

export default InsaneTransfersPage;
