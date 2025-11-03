// APP COMPONENT - Main Application
// This is the root component that handles routing

import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ModernDashboard from './pages/ModernDashboard';
import InsaneDashboard from './pages/InsaneDashboard';
import ProfilePage from './pages/ProfilePage';
import InsaneProfilePage from './pages/InsaneProfilePage';
import AccountDetailPage from './pages/AccountDetailPage';
import CardsPage from './pages/CardsPage';
import ModernCardsPage from './pages/ModernCardsPage';
import InsaneCardsPage from './pages/InsaneCardsPage';
import TransfersPage from './pages/TransfersPage';
import InsaneTransfersPage from './pages/InsaneTransfersPage';

// Protected Route Component
// Only allows access if user is authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If logged in, show the protected page
  return <>{children}</>;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes - Anyone can access */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes - Must be logged in */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ModernDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/:accountId"
          element={
            <ProtectedRoute>
              <AccountDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cards"
          element={
            <ProtectedRoute>
              <ModernCardsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfers"
          element={
            <ProtectedRoute>
              <TransfersPage />
            </ProtectedRoute>
          }
        />
        
        {/* Default Route - Redirect to dashboard or login */}
        <Route
          path="/"
          element={
            <Navigate to="/dashboard" replace />
          }
        />
        
        {/* 404 - Page not found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

// HOW ROUTING WORKS:
//
// URL MATCHING:
// /login         → LoginPage (public)
// /register      → RegisterPage (public)
// /dashboard     → DashboardPage (protected)
// /profile       → ProfilePage (protected)
// /              → Redirects to /dashboard
// /anything-else → Redirects to /
//
// PROTECTED ROUTES:
// 1. User visits /dashboard
// 2. ProtectedRoute checks: isAuthenticated?
// 3. If yes: Show DashboardPage
// 4. If no: Redirect to /login
//
// NAVIGATION FLOW:
// Not logged in → Visit / → Redirect to /dashboard → Redirect to /login
// Logged in → Visit / → Redirect to /dashboard → Show dashboard
//
// LOGIN FLOW:
// 1. User visits /login
// 2. Enters credentials
// 3. Redux updates: isAuthenticated = true
// 4. Navigate to /dashboard
// 5. ProtectedRoute sees authenticated
// 6. Shows dashboard
