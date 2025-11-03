// INSANE CARDS PAGE - Portfolio-Style Crazy Animations!

import { useEffect, useState, useRef } from 'react';
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

function InsaneCardsPage() {
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
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, index * 50);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );
    
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [cards, loading]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const accountsResponse = await userAPI.getAccounts();
      console.log('Full accounts response:', accountsResponse);
      console.log('Accounts data:', accountsResponse.data);
      
      // Handle different response structures
      const accountsData = accountsResponse.data?.data || accountsResponse.data || [];
      console.log('Extracted accounts:', accountsData);
      setAccounts(accountsData);
      
      if (accountsData.length === 0) {
        console.warn('No accounts found! User needs to create an account first.');
      }
      
      try {
        const cardsResponse = await cardAPI.getCards();
        console.log('Cards response:', cardsResponse);
        const cardsData = cardsResponse.data?.data || cardsResponse.data || [];
        setCards(cardsData);
      } catch (cardErr) {
        console.log('No cards yet or error fetching cards:', cardErr);
        setCards([]);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch data error:', err);
      console.error('Error response:', err.response);
      setError('Failed to load accounts. Check console for details.');
      setLoading(false);
    }
  };
  
  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating card...');
    console.log('Accounts available:', accounts);
    
    if (accounts.length === 0) {
      setError('No accounts available. Please create an account first.');
      console.error('No accounts found');
      return;
    }
    
    try {
      setCreating(true);
      setError(null);
      
      const accountId = accounts[0].id;
      console.log('Using account:', accountId);
      
      const expiryDate = createForm.expiryDate || 
        new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const cardData = {
        accountId,
        cardType: createForm.cardType,
        cardholderName: createForm.cardholderName || `${profile?.firstName} ${profile?.lastName}`,
        expiryDate,
        creditLimit: createForm.creditLimit ? parseFloat(createForm.creditLimit) : undefined,
      };
      
      console.log('Creating card with data:', cardData);
      const response = await cardAPI.createCard(cardData);
      console.log('Card created:', response.data);
      
      setSuccess('Card created successfully!');
      setShowCreateModal(false);
      setCreateForm({ cardType: 'DEBIT', cardholderName: '', expiryDate: '', creditLimit: '' });
      
      await fetchData();
      setCreating(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Card creation error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to create card. Check console for details.');
      setCreating(false);
    }
  };
  
  const handleToggleStatus = async (card: Card) => {
    try {
      const newStatus = card.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
      await cardAPI.updateCardStatus(card.id, newStatus);
      setSuccess(`Card ${newStatus.toLowerCase()}!`);
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Failed to update card');
    }
  };
  
  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Delete this card permanently?')) return;
    
    try {
      await cardAPI.deleteCard(cardId);
      setSuccess('Card deleted!');
      setShowDetailsModal(false);
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Failed to delete card');
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const formatCardNumber = (num: string) => `•••• •••• •••• ${num.slice(-4)}`;
  const formatExpiry = (date: string) => {
    const d = new Date(date);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`;
  };
  const getCardBrand = (num: string) => num.startsWith('4') ? 'Visa' : 'Mastercard';
  const getCardGradient = (type: string) => 
    type === 'DEBIT' 
      ? 'from-blue-600 via-cyan-500 to-teal-400'
      : 'from-purple-600 via-pink-500 to-rose-400';
  
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
      
      {/* Particles */}
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
                <Link to="/transfers" className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition">Transfers</Link>
                <Link to="/cards" className="px-4 py-2 rounded-lg bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/50">Cards</Link>
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
          ref={heroRef}
          className="mb-16 scroll-reveal opacity-0 translate-y-20"
          style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-4 leading-none">
            <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Your Cards
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400">
            Manage your digital wallet with style
          </p>
        </div>
        
        {/* Messages */}
        {success && (
          <div className="mb-8 bg-green-500/20 border-2 border-green-400/50 text-green-300 px-8 py-5 rounded-2xl shadow-2xl shadow-green-500/20 backdrop-blur-xl animate-bounce">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">✓</span>
              <span className="font-bold text-lg">{success}</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-8 bg-red-500/20 border-2 border-red-400/50 text-red-300 px-8 py-5 rounded-2xl shadow-2xl shadow-red-500/20 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">✗</span>
              <span className="font-bold text-lg">{error}</span>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block relative">
              <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="mt-8 text-2xl text-gray-400 font-semibold animate-pulse">Loading your cards...</p>
          </div>
        ) : (
          <>
            {/* Create Button with insane animation */}
            <div className="mb-16 scroll-reveal opacity-0 translate-y-20">
              <button
                onClick={() => {
                  console.log('Create button clicked');
                  console.log('Accounts:', accounts);
                  setShowCreateModal(true);
                }}
                className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-2xl font-black text-xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-500 hover:scale-110 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative z-10 flex items-center space-x-3">
                  <span className="text-3xl animate-bounce">+</span>
                  <span>Create New Card</span>
                </span>
              </button>
            </div>
            
            {/* Cards Grid */}
            {cards.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-16 text-center scroll-reveal opacity-0 border border-purple-500/20">
                <div className="text-8xl mb-6">💳</div>
                <h3 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">No cards yet</h3>
                <p className="text-xl text-gray-400 mb-8">Create your first card and start managing your finances</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
                >
                  Create Your First Card
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
                    className="scroll-reveal opacity-0 cursor-pointer group"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      transform: `translateY(${scrollY * 0.05 * (index % 2 === 0 ? 1 : -1)}px)`
                    }}
                  >
                    <div className={`relative bg-gradient-to-br ${getCardGradient(card.cardType)} rounded-3xl p-8 h-64 flex flex-col justify-between overflow-hidden transform-gpu transition-all duration-700 hover:scale-110 hover:rotate-3 group-hover:shadow-2xl shadow-xl`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className="absolute inset-0 rounded-3xl border-2 border-white/20 group-hover:border-white/40 transition-colors"></div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs uppercase tracking-widest opacity-75 font-bold">{card.cardType}</p>
                            <p className="text-2xl font-black mt-1">{getCardBrand(card.cardNumber)}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-lg text-xs font-black ${
                            card.status === 'ACTIVE' ? 'bg-green-400 text-green-900' :
                            card.status === 'BLOCKED' ? 'bg-red-400 text-red-900' : 'bg-gray-400 text-gray-900'
                          }`}>
                            {card.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative z-10">
                        <p className="text-3xl font-mono tracking-wider mb-4 group-hover:scale-110 transition-transform duration-300">
                          {formatCardNumber(card.cardNumber)}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-end relative z-10">
                        <div>
                          <p className="text-xs opacity-75 font-bold">CARDHOLDER</p>
                          <p className="font-black truncate max-w-[180px]">{card.cardholderName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75 font-bold">EXPIRES</p>
                          <p className="font-black">{formatExpiry(card.expiryDate)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm text-gray-400">
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
      
      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border-2 border-purple-500/50 rounded-3xl max-w-md w-full p-8 shadow-2xl shadow-purple-500/50 animate-scale-in transform-gpu">
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Create New Card
            </h2>
            
            <form onSubmit={handleCreateCard} className="space-y-6">
              <div>
                <label className="block text-sm font-black text-purple-300 mb-2 uppercase tracking-wider">Card Type</label>
                <select
                  value={createForm.cardType}
                  onChange={(e) => setCreateForm({ ...createForm, cardType: e.target.value as 'DEBIT' | 'CREDIT' })}
                  className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-purple-500/30 focus:border-purple-500 text-white font-bold transition-all"
                  required
                >
                  <option value="DEBIT">💳 Debit Card</option>
                  <option value="CREDIT">💎 Credit Card</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-black text-purple-300 mb-2 uppercase tracking-wider">Cardholder Name</label>
                <input
                  type="text"
                  value={createForm.cardholderName}
                  onChange={(e) => setCreateForm({ ...createForm, cardholderName: e.target.value })}
                  className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-purple-500/30 focus:border-purple-500 text-white font-bold transition-all placeholder-gray-500"
                  placeholder={`${profile?.firstName} ${profile?.lastName}`}
                />
                <p className="text-xs text-gray-500 mt-2">Leave blank to use your name</p>
              </div>
              
              <div>
                <label className="block text-sm font-black text-purple-300 mb-2 uppercase tracking-wider">Expiry Date</label>
                <input
                  type="date"
                  value={createForm.expiryDate}
                  onChange={(e) => setCreateForm({ ...createForm, expiryDate: e.target.value })}
                  className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-purple-500/30 focus:border-purple-500 text-white font-bold transition-all"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500 mt-2">Defaults to 3 years from now</p>
              </div>
              
              {createForm.cardType === 'CREDIT' && (
                <div>
                  <label className="block text-sm font-black text-purple-300 mb-2 uppercase tracking-wider">Credit Limit</label>
                  <input
                    type="number"
                    value={createForm.creditLimit}
                    onChange={(e) => setCreateForm({ ...createForm, creditLimit: e.target.value })}
                    className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-purple-500/30 focus:border-purple-500 text-white font-bold transition-all placeholder-gray-500"
                    placeholder="5000"
                    min="0"
                    step="100"
                  />
                </div>
              )}
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-4 bg-gray-800 text-gray-300 rounded-xl font-black hover:bg-gray-700 transition border-2 border-gray-700"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white rounded-xl font-black hover:scale-105 transition-transform shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:hover:scale-100"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border-2 border-purple-500/50 rounded-3xl max-w-md w-full p-8 shadow-2xl shadow-purple-500/50">
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">Card Details</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <p className="text-sm text-purple-300 font-bold uppercase mb-2">Card Number</p>
                <p className="text-2xl font-mono text-white">{selectedCard.cardNumber}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                  <p className="text-sm text-purple-300 font-bold uppercase mb-2">CVV</p>
                  <p className="text-2xl font-mono text-white">{selectedCard.cvv}</p>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                  <p className="text-sm text-purple-300 font-bold uppercase mb-2">Expiry</p>
                  <p className="text-2xl font-mono text-white">{formatExpiry(selectedCard.expiryDate)}</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <p className="text-sm text-purple-300 font-bold uppercase mb-2">Status</p>
                <span className={`inline-block px-4 py-2 rounded-full font-black ${
                  selectedCard.status === 'ACTIVE' ? 'bg-green-400/20 text-green-300 border-2 border-green-400/50' :
                  selectedCard.status === 'BLOCKED' ? 'bg-red-400/20 text-red-300 border-2 border-red-400/50' :
                  'bg-gray-400/20 text-gray-300 border-2 border-gray-400/50'
                }`}>
                  {selectedCard.status}
                </span>
              </div>
              
              <div className="pt-4 space-y-3">
                <button
                  onClick={() => handleToggleStatus(selectedCard)}
                  className={`w-full py-4 rounded-xl font-black transition-all hover:scale-105 ${
                    selectedCard.status === 'ACTIVE'
                      ? 'bg-yellow-500/20 text-yellow-300 border-2 border-yellow-500/50 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 text-green-300 border-2 border-green-500/50 hover:bg-green-500/30'
                  }`}
                >
                  {selectedCard.status === 'ACTIVE' ? '🔒 Block Card' : '🔓 Activate Card'}
                </button>
                
                <button
                  onClick={() => handleDeleteCard(selectedCard.id)}
                  className="w-full py-4 bg-red-500/20 text-red-300 border-2 border-red-500/50 rounded-xl font-black hover:bg-red-500/30 transition-all hover:scale-105"
                >
                  🗑️ Delete Card
                </button>
                
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full py-4 bg-gray-800 text-gray-300 rounded-xl font-black hover:bg-gray-700 transition border-2 border-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
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

export default InsaneCardsPage;
