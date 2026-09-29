import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crown, Menu, X, Shield, Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlayerAuth } from '../context/PlayerAuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { user, logout } = usePlayerAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Details', path: '/tournament' },
    { name: 'Prizes', path: '/prizes' },
    { name: 'Rules & Fair Play', path: '/rules' },
    { name: 'Players', path: '/players' },
    { name: 'Results', path: '/results' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#090b10]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Crown className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  CHECKMATE
                </span>
                <span className="font-display font-black text-xl tracking-tight text-amber-500">
                  ARENA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
                Competitive Online Chess
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/verify"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              Check Status
            </Link>

            <Link
              to="/register"
              className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Register Now
            </Link>

            {user ? (
              <div className="flex items-center gap-2 pl-1">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Player'}
                    className="w-8 h-8 rounded-full border border-amber-500/40 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs font-bold">
                    {(user.displayName || user.email || 'P').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden xl:block max-w-[120px] truncate text-xs font-semibold text-slate-200">
                  {user.displayName || user.email}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition-colors"
              >
                Login
              </Link>
            )}

            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="p-2 rounded-lg text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                title="Admin Dashboard"
              >
                <Shield className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                title="Organizer Portal"
              >
                <Shield className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-500"
            >
              Register
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#0c1018] border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'text-amber-400 bg-amber-500/10 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Player'}
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold">
                      {(user.displayName || user.email || 'P').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate text-sm text-slate-200">{user.displayName || user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 border border-slate-700 text-slate-200"
              >
                Login / Continue with Google
              </Link>
            )}
            <Link
              to="/verify"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 border border-slate-700 text-slate-200"
            >
              <Search className="w-4 h-4 text-amber-400" />
              Check Registration Status
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
            >
              <Shield className="w-3.5 h-3.5" />
              Organizer Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
