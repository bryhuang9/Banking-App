// INSANE PROFILE PAGE - Dark Neon Theme with Animations!

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { setProfile } from '../store/slices/userSlice';
import { RootState, AppDispatch } from '../store/store';
import { userAPI } from '../api/user.api';

function InsaneProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { profile } = useSelector((state: RootState) => state.user);
  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
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
  }, []);
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      const profileData = response.data.data;
      dispatch(setProfile(profileData));
      
      setForm({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phoneNumber: profileData.phoneNumber || '',
        address: profileData.address || '',
      });
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error:', err);
      setError('Failed to load profile');
      setLoading(false);
    }
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError(null);
      
      await userAPI.updateProfile(form);
      
      setSuccess('Profile updated successfully! ✨');
      setEditing(false);
      await fetchProfile();
      setUpdating(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setUpdating(false);
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
                <Link to="/transfers" className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition">Transfers</Link>
                <Link to="/cards" className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition">Cards</Link>
                <Link to="/profile" className="px-4 py-2 rounded-lg bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/50">Profile</Link>
              </div>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 transition">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div 
          className="mb-12 scroll-reveal opacity-0 translate-y-20"
          style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-4 leading-none">
            <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Your Profile
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400">
            Manage your account settings
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
            {/* Profile Card */}
            <div className="lg:col-span-1 scroll-reveal opacity-0 translate-y-20">
              <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-6xl font-black">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </div>
                  <h2 className="text-3xl font-black mb-2">{profile?.firstName} {profile?.lastName}</h2>
                  <p className="text-white/80 mb-1">{profile?.email}</p>
                  <p className="text-white/60 text-sm">{profile?.phoneNumber || 'No phone number'}</p>
                  
                  <div className="mt-8 space-y-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                      <p className="text-xs uppercase tracking-wider opacity-75">Member Since</p>
                      <p className="font-black">{new Date(profile?.createdAt || '').toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                      <p className="text-xs uppercase tracking-wider opacity-75">Account Status</p>
                      <p className="font-black text-green-300">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile Form */}
            <div className="lg:col-span-2 scroll-reveal opacity-0 translate-y-20">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-black text-white">Profile Information</h3>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-black hover:scale-105 transition-transform"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-black text-purple-300 mb-2 uppercase tracking-wider">First Name</label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-4 rounded-xl bg-gray-800 border-2 ${
                          editing ? 'border-purple-500/30 focus:border-purple-500' : 'border-gray-700'
                        } text-white font-bold transition-all disabled:opacity-50`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-purple-300 mb-2 uppercase tracking-wider">Last Name</label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        disabled={!editing}
                        className={`w-full px-4 py-4 rounded-xl bg-gray-800 border-2 ${
                          editing ? 'border-purple-500/30 focus:border-purple-500' : 'border-gray-700'
                        } text-white font-bold transition-all disabled:opacity-50`}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-black text-purple-300 mb-2 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      disabled
                      className="w-full px-4 py-4 rounded-xl bg-gray-800 border-2 border-gray-700 text-white font-bold opacity-50"
                    />
                    <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-black text-purple-300 mb-2 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phoneNumber}
                      onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                      disabled={!editing}
                      className={`w-full px-4 py-4 rounded-xl bg-gray-800 border-2 ${
                        editing ? 'border-purple-500/30 focus:border-purple-500' : 'border-gray-700'
                      } text-white font-bold transition-all disabled:opacity-50`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-black text-purple-300 mb-2 uppercase tracking-wider">Address</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      disabled={!editing}
                      rows={3}
                      className={`w-full px-4 py-4 rounded-xl bg-gray-800 border-2 ${
                        editing ? 'border-purple-500/30 focus:border-purple-500' : 'border-gray-700'
                      } text-white font-bold transition-all disabled:opacity-50 resize-none`}
                      placeholder="123 Main St, City, State 12345"
                    />
                  </div>
                  
                  {editing && (
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setForm({
                            firstName: profile?.firstName || '',
                            lastName: profile?.lastName || '',
                            email: profile?.email || '',
                            phoneNumber: profile?.phoneNumber || '',
                            address: profile?.address || '',
                          });
                        }}
                        className="flex-1 px-6 py-4 bg-gray-800 text-gray-300 rounded-xl font-black hover:bg-gray-700 transition border-2 border-gray-700"
                        disabled={updating}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white rounded-xl font-black hover:scale-105 transition-transform shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:hover:scale-100"
                        disabled={updating}
                      >
                        {updating ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
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

export default InsaneProfilePage;
