// TRANSFERS PAGE - Send Money & Manage Transactions
// Transfer between own accounts, send to others, deposit, withdraw

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

function TransfersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  // Active tab
  const [activeTab, setActiveTab] = useState<'transfer' | 'deposit' | 'withdraw'>('transfer');
  
  // Transfer form
  const [transferForm, setTransferForm] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    amount: '',
    description: '',
  });
  
  // Deposit form
  const [depositForm, setDepositForm] = useState({
    accountId: '',
    amount: '',
    description: '',
  });
  
  // Withdraw form
  const [withdrawForm, setWithdrawForm] = useState({
    accountId: '',
    amount: '',
    description: '',
  });
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const accountsResponse = await userAPI.getAccounts();
      setAccounts(accountsResponse.data.data || []);
      
      // Fetch recent transactions from first account
      if (accountsResponse.data.data?.length > 0) {
        const firstAccount = accountsResponse.data.data[0];
        const transResponse = await userAPI.getTransactions(firstAccount.id, { limit: 10 });
        setTransactions(transResponse.data.data || []);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };
  
  // Handle Transfer
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
      
      setSuccess('Transfer completed successfully!');
      setTransferForm({ fromAccountId: '', toAccountNumber: '', amount: '', description: '' });
      await fetchData();
      setProcessing(false);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Transfer error:', err);
      setError(err.response?.data?.message || 'Transfer failed');
      setProcessing(false);
    }
  };
  
  // Handle Deposit
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
      
      setSuccess('Deposit completed successfully!');
      setDepositForm({ accountId: '', amount: '', description: '' });
      await fetchData();
      setProcessing(false);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Deposit error:', err);
      setError(err.response?.data?.message || 'Deposit failed');
      setProcessing(false);
    }
  };
  
  // Handle Withdraw
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
      
      setSuccess('Withdrawal completed successfully!');
      setWithdrawForm({ accountId: '', amount: '', description: '' });
      await fetchData();
      setProcessing(false);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Withdraw error:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-1 inline-block">
                ← Back
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Transfers & Transactions
              </h1>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-sm">
            ✓ {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
            ✗ {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Transaction Forms */}
            <div className="lg:col-span-2">
              {/* Modern Tabs */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('transfer')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      activeTab === 'transfer'
                        ? 'bg-white shadow-sm text-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-xl mr-2">💸</span>
                    Transfer
                  </button>
                  <button
                    onClick={() => setActiveTab('deposit')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      activeTab === 'deposit'
                        ? 'bg-white shadow-sm text-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-xl mr-2">💰</span>
                    Deposit
                  </button>
                  <button
                    onClick={() => setActiveTab('withdraw')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      activeTab === 'withdraw'
                        ? 'bg-white shadow-sm text-red-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-xl mr-2">🏧</span>
                    Withdraw
                  </button>
                </div>
                
                {/* Transfer Form */}
                {activeTab === 'transfer' && (
                  <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        From Account
                      </label>
                      <select
                        value={transferForm.fromAccountId}
                        onChange={(e) => setTransferForm({ ...transferForm, fromAccountId: e.target.value })}
                        className="input"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        To Account Number
                      </label>
                      <input
                        type="text"
                        value={transferForm.toAccountNumber}
                        onChange={(e) => setTransferForm({ ...transferForm, toAccountNumber: e.target.value })}
                        className="input"
                        placeholder="Enter account number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={transferForm.amount}
                        onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                        className="input"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={transferForm.description}
                        onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                        className="input"
                        placeholder="What's this for?"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : 'Send Money'}
                    </button>
                  </form>
                )}
                
                {/* Deposit Form */}
                {activeTab === 'deposit' && (
                  <form onSubmit={handleDeposit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        To Account
                      </label>
                      <select
                        value={depositForm.accountId}
                        onChange={(e) => setDepositForm({ ...depositForm, accountId: e.target.value })}
                        className="input"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={depositForm.amount}
                        onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                        className="input"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={depositForm.description}
                        onChange={(e) => setDepositForm({ ...depositForm, description: e.target.value })}
                        className="input"
                        placeholder="Source of deposit"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : 'Deposit Money'}
                    </button>
                  </form>
                )}
                
                {/* Withdraw Form */}
                {activeTab === 'withdraw' && (
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        From Account
                      </label>
                      <select
                        value={withdrawForm.accountId}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, accountId: e.target.value })}
                        className="input"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={withdrawForm.amount}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                        className="input"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={withdrawForm.description}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, description: e.target.value })}
                        className="input"
                        placeholder="Purpose of withdrawal"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : 'Withdraw Money'}
                    </button>
                  </form>
                )}
              </div>
            </div>
            
            {/* Right: Quick Stats & Recent Transactions */}
            <div className="space-y-6">
              {/* Account Balances */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Accounts</h3>
                <div className="space-y-3">
                  {accounts.map((acc) => (
                    <div key={acc.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <p className="text-sm text-gray-600">{acc.accountType}</p>
                      <p className="text-xs text-gray-500">•••• {acc.accountNumber.slice(-4)}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(acc.balance)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recent Transactions */}
              {transactions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((txn) => (
                      <div key={txn.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{txn.description}</p>
                          <p className="text-xs text-gray-500">{new Date(txn.transactionDate).toLocaleDateString()}</p>
                        </div>
                        <p className={`font-bold ${
                          txn.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
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
    </div>
  );
}

export default TransfersPage;
