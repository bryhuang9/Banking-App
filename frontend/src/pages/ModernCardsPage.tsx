// MODERN CARDS PAGE - Beautiful UI with Scroll Animations
// Manage bank cards with stunning design

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store/store';
import { cardAPI } from '../api/card.api';
import { userAPI } from '../api/user.api';

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

interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: string;
}

function ModernCardsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { profile } = useSelector((state: RootState) => state.user);
  
  const [cards, setCards] = useState<Card[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    cardType: 'DEBIT' as 'DEBIT' | 'CREDIT',
    cardholderName: '',
    expiryDate: '',
    creditLimit: '',
  });
  
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));
    
    return () => observer.disconnect();
  }, [cards]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const accountsResponse = await userAPI.getAccounts();
        setAccounts(accountsResponse.data.data || []);
      } catch (accountErr: any) {
        console.error('Error fetching accounts:', accountErr);
        setError('Failed to load accounts');
      }
      
      try {
        const cardsResponse = await cardAPI.getCards();
        setCards(cardsResponse.data.data || []);
      } catch (cardErr: any) {
        console.log('No cards yet');
        setCards([]);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };
  
  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accounts.length === 0) {
      setError('No accounts available');
      return;
    }
    
    try {
      setCreating(true);
      setError(null);
      
      const accountId = accounts[0].id;
      const expiryDate = createForm.expiryDate || 
        new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      await cardAPI.createCard({
        accountId,
        cardType: createForm.cardType,
        cardholderName: createForm.cardholderName || `${profile?.firstName} ${profile?.lastName}`,
        expiryDate,
        creditLimit: createForm.creditLimit ? parseFloat(createForm.creditLimit) : undefined,
      });
      
      setSuccess('Card created successfully! 🎉');
      setShowCreateModal(false);
      setCreateForm({ cardType: 'DEBIT', cardholderName: '', expiryDate: '', creditLimit: '' });
      await fetchData();
      setCreating(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Failed to create card');
      setCreating(false);
    }
  };
  
  const handleToggleStatus = async (card: Card) => {
    try {
      setError(null);
      const newStatus = card.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
      await cardAPI.updateCardStatus(card.id, newStatus);
      setSuccess(`Card ${newStatus === 'BLOCKED' ? 'blocked' : 'activated'}! ✓`);
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error:', err);
      setError('Failed to update card');
    }
  };
  
  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Delete this card permanently?')) return;
    
    try {
      setError(null);
      await cardAPI.deleteCard(cardId);
      setSuccess('Card deleted successfully!');
      setShowDetailsModal(false);
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error:', err);
      setError('Failed to delete card');
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const formatCardNumber = (cardNumber: string) => `•••• •••• •••• ${cardNumber.slice(-4)}`;
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${year}`;
  };
  const getCardBrand = (cardNumber: string) => cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
  const getCardColor = (cardType: string) => 
    cardType === 'DEBIT' 
      ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
      : 'bg-gradient-to-br from-purple-500 to-pink-500';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Modern Nav */}
      <nav className="relative bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                BankFlow
              </Link>
              <div className="hidden md:flex space-x-1">
                <Link to="/dashboard" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition">Dashboard</Link>
                <Link to="/transfers" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition">Transfers</Link>
                <Link to="/cards" className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold">Cards</Link>
                <Link to="/profile" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition">Profile</Link>
              </div>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 scroll-animate opacity-0">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Cards</span>
          </h1>
          <p className="text-gray-600 text-lg">Manage your debit and credit cards</p>
        </div>
        
        {/* Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl shadow-lg scroll-animate opacity-0">
            ✓ {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-lg scroll-animate opacity-0">
            ✗ {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading cards...</p>
          </div>
        ) : (
          <>
            {/* Add Card Button */}
            <div className="mb-8 scroll-animate opacity-0">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                + Create New Card
              </button>
            </div>
            
            {/* Cards Grid */}
            {cards.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-12 text-center scroll-animate opacity-0 border border-white/20">
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No cards yet</h3>
                <p className="text-gray-600 mb-6">Create your first card to get started</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Create Card
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setSelectedCard(card);
                      setShowDetailsModal(true);
                    }}
                    className="scroll-animate opacity-0 cursor-pointer transform transition-all hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* 3D Card */}
                    <div className={`${getCardColor(card.cardType)} rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl h-56 flex flex-col justify-between relative overflow-hidden transform-gpu perspective-1000`}>
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                      
                      {/* Decorative */}
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs uppercase tracking-wide opacity-75">{card.cardType}</p>
                            <p className="text-lg font-bold mt-1">{getCardBrand(card.cardNumber)}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            card.status === 'ACTIVE' ? 'bg-green-500' :
                            card.status === 'BLOCKED' ? 'bg-red-500' : 'bg-gray-500'
                          }`}>
                            {card.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative z-10">
                        <p className="text-2xl font-mono tracking-wider mb-4">
                          {formatCardNumber(card.cardNumber)}
                        </p>
                      </div>
                      
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
                    
                    <div className="mt-3 text-center">
                      <p className="text-sm text-gray-600">
                        {card.account?.accountType} •••• {card.account?.accountNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Create Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform animate-scaleIn">
            <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Create New Card</h2>
            
            <form onSubmit={handleCreateCard} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Card Type</label>
                <select
                  value={createForm.cardType}
                  onChange={(e) => setCreateForm({ ...createForm, cardType: e.target.value as 'DEBIT' | 'CREDIT' })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  required
                >
                  <option value="DEBIT">💳 Debit Card</option>
                  <option value="CREDIT">💎 Credit Card</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={createForm.cardholderName}
                  onChange={(e) => setCreateForm({ ...createForm, cardholderName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder={`${profile?.firstName} ${profile?.lastName}`}
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to use your name</p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={createForm.expiryDate}
                  onChange={(e) => setCreateForm({ ...createForm, expiryDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500 mt-1">Defaults to 3 years from now</p>
              </div>
              
              {createForm.cardType === 'CREDIT' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Credit Limit</label>
                  <input
                    type="number"
                    value={createForm.creditLimit}
                    onChange={(e) => setCreateForm({ ...createForm, creditLimit: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="5000"
                    min="0"
                    step="100"
                  />
                </div>
              )}
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform animate-scaleIn">
            <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Card Details</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Card Number</p>
                <p className="text-xl font-mono">{selectedCard.cardNumber}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 font-semibold">CVV</p>
                <p className="text-xl font-mono">{selectedCard.cvv}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 font-semibold">Expiry Date</p>
                <p className="text-xl">{formatExpiryDate(selectedCard.expiryDate)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 font-semibold">Status</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  selectedCard.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  selectedCard.status === 'BLOCKED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedCard.status}
                </span>
              </div>
              
              <div className="pt-4 space-y-3">
                <button
                  onClick={() => handleToggleStatus(selectedCard)}
                  className={`w-full py-3 rounded-xl font-bold transition ${
                    selectedCard.status === 'ACTIVE'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {selectedCard.status === 'ACTIVE' ? '🔒 Block Card' : '🔓 Activate Card'}
                </button>
                
                <button
                  onClick={() => handleDeleteCard(selectedCard.id)}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition"
                >
                  🗑️ Delete Card
                </button>
                
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .scroll-animate {
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ModernCardsPage;
