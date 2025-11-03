// ACCOUNT DETAIL PAGE - View Account Transactions
// Shows detailed account information and transaction history with filtering

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { userAPI } from '../api/user.api';

// Transaction type
interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT';
  amount: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionDate: string;
  createdAt: string;
}

// Account type
interface Account {
  id: string;
  accountNumber: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'CREDIT';
  balance: string;
  currency: string;
  isActive: boolean;
}

function AccountDetailPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30'); // Last 30 days
  
  // Fetch account and transactions
  useEffect(() => {
    const fetchData = async () => {
      if (!accountId) return;
      
      try {
        setLoading(true);
        
        // Fetch account details
        const accountResponse = await userAPI.getAccount(accountId);
        setAccount(accountResponse.data.data);
        
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(dateRange));
        
        // Fetch transactions with filters
        const params: any = {
          limit: 50,
          offset: 0,
        };
        
        if (typeFilter !== 'all') {
          params.type = typeFilter;
        }
        
        if (dateRange !== 'all') {
          params.startDate = startDate.toISOString();
          params.endDate = endDate.toISOString();
        }
        
        const transactionsResponse = await userAPI.getTransactions(accountId, params);
        setTransactions(transactionsResponse.data.data);
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load account details');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [accountId, typeFilter, dateRange]);
  
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
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Get transaction color
  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'text-green-600';
      case 'WITHDRAWAL': return 'text-red-600';
      case 'TRANSFER': return 'text-blue-600';
      case 'PAYMENT': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };
  
  // Get transaction sign
  const getTransactionSign = (type: string) => {
    return type === 'DEPOSIT' ? '+' : '-';
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Account Details</h1>
            {account && (
              <p className="mt-1 text-sm text-gray-600">
                {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()} Account ****
                {account.accountNumber.slice(-4)}
              </p>
            )}
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading account details...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-semibold">Error</h3>
            <p className="mt-1">{error}</p>
          </div>
        )}
        
        {/* Account Info Card */}
        {!loading && !error && account && (
          <>
            <div className="card mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()} Account
                  </h2>
                  <p className="text-gray-600">Account Number: {account.accountNumber}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Status: {account.isActive ? '✅ Active' : '❌ Inactive'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{account.currency}</p>
                </div>
              </div>
            </div>
            
            {/* Filters */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Transactions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Transaction Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="input"
                  >
                    <option value="all">All Types</option>
                    <option value="DEPOSIT">Deposits</option>
                    <option value="WITHDRAWAL">Withdrawals</option>
                    <option value="TRANSFER">Transfers</option>
                    <option value="PAYMENT">Payments</option>
                  </select>
                </div>
                
                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="input"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="all">All time</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Transactions List */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Transaction History ({transactions.length})
              </h3>
              
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No transactions found</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              transaction.type === 'DEPOSIT'
                                ? 'bg-green-100 text-green-800'
                                : transaction.type === 'WITHDRAWAL'
                                ? 'bg-red-100 text-red-800'
                                : transaction.type === 'TRANSFER'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {transaction.type}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              transaction.status === 'COMPLETED'
                                ? 'bg-green-50 text-green-700'
                                : transaction.status === 'PENDING'
                                ? 'bg-yellow-50 text-yellow-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 mt-2">{transaction.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(transaction.transactionDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getTransactionColor(transaction.type)}`}>
                          {getTransactionSign(transaction.type)}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AccountDetailPage;

// FEATURES:
// ✅ View account details
// ✅ See current balance
// ✅ List all transactions
// ✅ Filter by transaction type
// ✅ Filter by date range
// ✅ Beautiful UI with status badges
// ✅ Color-coded transactions
// ✅ Loading and error states
