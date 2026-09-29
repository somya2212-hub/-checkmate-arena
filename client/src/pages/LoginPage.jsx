import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Crown, Shield } from 'lucide-react';
import { usePlayerAuth } from '../context/PlayerAuthContext';
import { ContinueWithGoogleButton } from '../components/ContinueWithGoogleButton';

export const LoginPage = () => {
  const { user, loginWithGoogle } = usePlayerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const redirectTo = location.state?.from || '/register';

  const handleGoogleLogin = async () => {
    setError('');
    const result = await loginWithGoogle();
    if (result.success) {
      navigate(redirectTo, { replace: true });
      return;
    }
    setError(result.message);
  };

  if (user) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center px-4 chess-pattern-bg">
        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
          <Crown className="w-8 h-8 text-amber-400 mx-auto" />
          <h1 className="font-display font-black text-2xl text-white">You are signed in</h1>
          <p className="text-sm text-slate-400">
            Continue to tournament registration with your Chess.com username and payment details.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
          >
            Continue to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 flex items-center justify-center px-4 chess-pattern-bg">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display font-black text-2xl text-white tracking-tight">Player Sign In</h1>
          <p className="text-xs text-slate-400">
            Sign in with Google to register for Checkmate Arena tournaments. We never ask for your Google password.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <ContinueWithGoogleButton onClick={handleGoogleLogin} />
          <p className="text-[11px] text-slate-500 text-center">
            After signing in you can enter your Chess.com username and complete Razorpay payment.
          </p>
        </div>
      </div>
    </div>
  );
};
