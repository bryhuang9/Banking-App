// CARDS PAGE - Manage Bank Cards
// View, create, block/unblock, and delete debit/credit cards

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store/store';
import { cardAPI } from '../api/card.api';
import { userAPI } from '../api/user.api';

// Card type
interface Card {
  id: string;
  cardNumber: string;
  cardType: 'DEBIT' | 'CREDIT';
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  creditLimit?: string;
  accountId: string;
  createdAt: string;
  account?: {
    accountNumber: string;
    accountType: string;
  };
}

// Account type (for dropdown)
interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: string;
}

function CardsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { profile } = useSelector((state: RootState) => state.user);
  
  const [cards, setCards] = useState<Card[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Create card modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    cardType: 'DEBIT' as 'DEBIT' | 'CREDIT',
    cardholderName: '',
    expiryDate: '',
    creditLimit: '',
  });
  
  // Card details modal
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Fetch cards and accounts on mount
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch accounts first (critical for card creation)
      try {
        const accountsResponse = await userAPI.getAccounts();
        console.log('Accounts response:', accountsResponse.data);
        setAccounts(accountsResponse.data.data || []);
      } catch (accountErr: any) {
        console.error('Error fetching accounts:', accountErr);
        setError('Failed to load accounts');
      }
      
      // Fetch cards (optional, might be empty)
      try {
        const cardsResponse = await cardAPI.getCards();
        console.log('Cards response:', cardsResponse.data);
        setCards(cardsResponse.data.data || []);
      } catch (cardErr: any) {
        console.log('No cards yet or error fetching cards:', cardErr);
        setCards([]);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
      setLoading(false);
    }
  };
  
  // Handle create card
  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accounts.length === 0) {
      setError('No accounts available. Please create an account first.');
      return;
    }
    
    try {
      setCreating(true);
      setError(null);
      
      // Use first account automatically
      const accountId = accounts[0].id;
      
      // Calculate expiry date (3 years from now if not set)
      const expiryDate = createForm.expiryDate || 
        new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      await cardAPI.createCard({
        accountId,
        cardType: createForm.cardType,
        cardholderName: createForm.cardholderName || `${profile?.firstName} ${profile?.lastName}`,
        expiryDate,
        creditLimit: createForm.creditLimit ? parseFloat(createForm.creditLimit) : undefined,
      });
      
      setSuccess('Card created successfully!');
      setShowCreateModal(false);
      setCreateForm({
        cardType: 'DEBIT',
        cardholderName: '',
        expiryDate: '',
        creditLimit: '',
      });
      
      // Refresh cards
      await fetchData();
      
      setCreating(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error creating card:', err);
      setError(err.response?.data?.message || 'Failed to create card');
      setCreating(false);
    }
  };
  
  // Handle block/unblock card
  const handleToggleStatus = async (card: Card) => {
    try {
      setError(null);
      const newStatus = card.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
      
      await cardAPI.updateCardStatus(card.id, newStatus);
      
      setSuccess(`Card ${newStatus === 'BLOCKED' ? 'blocked' : 'activated'} successfully!`);
      await fetchData();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating card:', err);
      setError(err.response?.data?.message || 'Failed to update card');
    }
  };
  
  // Handle delete card
  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return;
    }
    
    try {
      setError(null);
      
      await cardAPI.deleteCard(cardId);
      
      setSuccess('Card deleted successfully!');
      setShowDetailsModal(false);
      await fetchData();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting card:', err);
      setError(err.response?.data?.message || 'Failed to delete card');
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  // Format card number for display
  const formatCardNumber = (cardNumber: string) => {
    return `•••• •••• •••• ${cardNumber.slice(-4)}`;
  };
  
  // Format expiry date
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${year}`;
  };
  
  // Get card brand from number
  const getCardBrand = (cardNumber: string) => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    return 'Card';
  };
  
  // Get card color
  const getCardColor = (cardType: string) => {
    return cardType === 'DEBIT' 
      ? 'bg-gradient-to-br from-blue-500 to-blue-700'
      : 'bg-gradient-to-br from-purple-500 to-purple-700';
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
            <h1 className="text-3xl font-bold text-gray-900">My Cards</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your debit and credit cards
            </p>
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
            <p className="mt-4 text-gray-600">Loading cards...</p>
          </div>
        )}
        
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
            {success}
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Create Card Button */}
        {!loading && (
          <div className="mb-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              + Add New Card
            </button>
          </div>
        )}
        
        {/* Cards Grid */}
        {!loading && cards.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cards yet</h3>
            <p className="text-gray-600 mb-6">Create your first card to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              Create Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  setSelectedCard(card);
                  setShowDetailsModal(true);
                }}
                className="cursor-pointer transform transition-transform hover:scale-105"
              >
                {/* Card Design */}
                <div className={`${getCardColor(card.cardType)} rounded-xl p-6 text-white shadow-lg h-52 flex flex-col justify-between relative overflow-hidden`}>
                  {/* Decorative circles */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-xs uppercase tracking-wide opacity-75">{card.cardType}</p>
                      <p className="text-lg font-bold mt-1">{getCardBrand(card.cardNumber)}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      card.status === 'ACTIVE' ? 'bg-green-500' :
                      card.status === 'BLOCKED' ? 'bg-red-500' : 'bg-gray-500'
                    }`}>
                      {card.status}
                    </div>
                  </div>
                  
                  {/* Card Number */}
                  <div className="relative z-10">
                    <p className="text-2xl font-mono tracking-wider">
                      {formatCardNumber(card.cardNumber)}
                    </p>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <p className="text-xs opacity-75">CARDHOLDER</p>
                      <p className="font-semibold truncate max-w-[200px]">{card.cardholderName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-75">EXPIRES</p>
                      <p className="font-semibold">{formatExpiryDate(card.expiryDate)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Card Info Below */}
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-600">
                    {card.account?.accountType} •••• {card.account?.accountNumber.slice(-4)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Create Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Card</h2>
            
            <form onSubmit={handleCreateCard} className="space-y-4">
              {/* Card Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Type *
                </label>
                <select
                  value={createForm.cardType}
                  onChange={(e) => setCreateForm({ ...createForm, cardType: e.target.value as 'DEBIT' | 'CREDIT' })}
                  className="input"
                  required
                >
                  <option value="DEBIT">Debit Card</option>
                  <option value="CREDIT">Credit Card</option>
                </select>
              </div>
              
              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={createForm.cardholderName}
                  onChange={(e) => setCreateForm({ ...createForm, cardholderName: e.target.value })}
                  className="input"
                  placeholder={`${profile?.firstName} ${profile?.lastName}`}
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to use your name</p>
              </div>
              
              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={createForm.expiryDate}
                  onChange={(e) => setCreateForm({ ...createForm, expiryDate: e.target.value })}
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank for 3 years from now</p>
              </div>
              
              {/* Credit Limit (only for credit cards) */}
              {createForm.cardType === 'CREDIT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Limit
                  </label>
                  <input
                    type="number"
                    value={createForm.creditLimit}
                    onChange={(e) => setCreateForm({ ...createForm, creditLimit: e.target.value })}
                    className="input"
                    placeholder="5000"
                    min="0"
                    step="100"
                  />
                </div>
              )}
              
              {/* Buttons */}
              <div className="flex space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary flex-1"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Card Details Modal */}
      {showDetailsModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Card Details</h2>
            
            <div className="space-y-4">
              {/* Full Card Number */}
              <div>
                <p className="text-sm text-gray-600">Card Number</p>
                <p className="text-lg font-mono">{selectedCard.cardNumber}</p>
              </div>
              
              {/* CVV */}
              <div>
                <p className="text-sm text-gray-600">CVV</p>
                <p className="text-lg font-mono">{selectedCard.cvv}</p>
              </div>
              
              {/* Expiry */}
              <div>
                <p className="text-sm text-gray-600">Expiry Date</p>
                <p className="text-lg">{formatExpiryDate(selectedCard.expiryDate)}</p>
              </div>
              
              {/* Status */}
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedCard.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  selectedCard.status === 'BLOCKED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedCard.status}
                </span>
              </div>
              
              {/* Account */}
              <div>
                <p className="text-sm text-gray-600">Linked Account</p>
                <p className="text-lg">{selectedCard.account?.accountType} •••• {selectedCard.account?.accountNumber.slice(-4)}</p>
              </div>
              
              {/* Credit Limit (if credit card) */}
              {selectedCard.cardType === 'CREDIT' && selectedCard.creditLimit && (
                <div>
                  <p className="text-sm text-gray-600">Credit Limit</p>
                  <p className="text-lg">${parseFloat(selectedCard.creditLimit).toLocaleString()}</p>
                </div>
              )}
              
              {/* Actions */}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => handleToggleStatus(selectedCard)}
                  className={`w-full btn ${selectedCard.status === 'ACTIVE' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  {selectedCard.status === 'ACTIVE' ? '🔒 Block Card' : '🔓 Activate Card'}
                </button>
                
                <button
                  onClick={() => handleDeleteCard(selectedCard.id)}
                  className="w-full btn bg-red-600 hover:bg-red-700 text-white"
                >
                  🗑️ Delete Card
                </button>
                
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardsPage;
