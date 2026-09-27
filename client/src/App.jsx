import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

import { Home } from './pages/Home';
import { TournamentDetails } from './pages/TournamentDetails';
import { PrizePoolPage } from './pages/PrizePoolPage';
import { RulesPage } from './pages/RulesPage';
import { RegisterPage } from './pages/RegisterPage';
import { RegistrationSuccessPage } from './pages/RegistrationSuccessPage';
import { VerifyRegistrationPage } from './pages/VerifyRegistrationPage';
import { RegisteredPlayersPage } from './pages/RegisteredPlayersPage';
import { PreviousTournamentsPage } from './pages/PreviousTournamentsPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Protected Route Wrapper for Admin Dashboard
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090b10] flex items-center justify-center text-amber-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating Organizer Portal...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#090b10] text-slate-100">
        
        {/* Render Public Navbar & Floating WhatsApp unless inside admin dashboard */}
        {!isAdminPath && <Navbar />}

        <main className="flex-1">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/tournament" element={<TournamentDetails />} />
            <Route path="/prizes" element={<PrizePoolPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/success" element={<RegistrationSuccessPage />} />
            <Route path="/verify" element={<VerifyRegistrationPage />} />
            <Route path="/players" element={<RegisteredPlayersPage />} />
            <Route path="/results" element={<PreviousTournamentsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin Authentication & Management */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardPage />
                </ProtectedAdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!isAdminPath && <Footer />}
        {!isAdminPath && <FloatingWhatsApp />}

      </div>
    </AuthProvider>
  );
}

export default App;
