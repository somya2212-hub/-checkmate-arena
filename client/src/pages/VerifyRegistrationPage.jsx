import React, { useState } from 'react';
import { Search, ShieldCheck, Clock, CheckCircle2, XCircle, AlertCircle, ExternalLink, Key, Lock, Copy, Check } from 'lucide-react';
import { lookupRegistration } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const VerifyRegistrationPage = () => {
  const [registrationId, setRegistrationId] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!registrationId.trim() || !emailOrPhone.trim()) {
      setError('Please provide both Registration ID and your registered Email or Phone.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await lookupRegistration({
        registrationId: registrationId.trim(),
        emailOrPhone: emailOrPhone.trim(),
      });

      if (res.data.success) {
        setResult(res.data.data);
      } else {
        setError(res.data.message || 'No matching registration found.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to retrieve registration. Please verify your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyClubLink = () => {
    if (result?.chessClub?.link) {
      navigator.clipboard.writeText(result.chessClub.link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen py-12 relative chess-pattern-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Player Portal
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Check Registration Status
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Track your payment confirmation, arbiter WhatsApp verification, and access your private Chess.com club joining link once verified.
          </p>
        </div>

        {/* Lookup Form */}
        <form onSubmit={handleLookup} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Registration ID input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Registration ID (e.g. CA-8F42K7) *</span>
              </label>
              <input
                type="text"
                value={registrationId}
                onChange={(e) => setRegistrationId(e.target.value)}
                placeholder="CA-XXXXXX"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm font-mono text-amber-400 uppercase placeholder-slate-600 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Email or Phone verification */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Registered Email or Phone *</span>
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="player@example.com or +91..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                required
              />
            </div>

          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Looking up pass...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Verify & Check Status</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500 text-center">
            For privacy security, status is only shown when both Registration ID and registered contact match.
          </p>
        </form>

        {/* Lookup Result Card */}
        {result && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8 animate-fade-in">
            
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Registration Verified
                </span>
                <h3 className="font-display font-bold text-xl text-white">
                  {result.tournament?.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Player: <span className="font-semibold text-slate-200">{result.fullName}</span> • Chess.com: <span className="font-mono text-amber-400 font-bold">{result.chessUsername}</span>
                </p>
              </div>

              <div className="font-mono text-sm font-bold bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/25">
                {result.registrationId}
              </div>
            </div>

            {/* Status Pipeline Timeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Registration Pipeline Status
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Payment */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 block font-medium">1. Entry Fee Payment</span>
                  <StatusBadge type="payment" status={result.paymentStatus} />
                </div>

                {/* 2. WhatsApp Verification */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 block font-medium">2. Arbiter Verification</span>
                  <StatusBadge type="verification" status={result.verificationStatus} />
                </div>

                {/* 3. Club Access */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 block font-medium">3. Private Club Access</span>
                  <StatusBadge type="club" status={result.clubStatus} />
                </div>
              </div>
            </div>

            {/* Rejection / Action notice if any */}
            {result.verificationStatus === 'REJECTED' && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs space-y-1">
                <div className="font-bold text-red-200 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Registration Status: Action Required / Rejected</span>
                </div>
                <p>Reason: {result.rejectionReason || 'Discrepancy in Chess.com username or verification details.'}</p>
                <p>Please contact tournament support on WhatsApp for assistance.</p>
              </div>
            )}

            {/* WhatsApp Reminder if Verification is Pending */}
            {result.verificationStatus === 'PENDING' && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs space-y-3">
                <div className="font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Pending Arbiter Verification on WhatsApp</span>
                </div>
                <p>
                  Have you sent your Registration ID (<strong>{result.registrationId}</strong>) and Chess.com username (<strong>{result.chessUsername}</strong>) to the organizer on WhatsApp? Our arbiter will verify your details and approve club access.
                </p>
                <a
                  href={`https://wa.me/919876543210?text=Hello%20Checkmate%20Arena,%0AI%20have%20registered.%0ARegistration%20ID:%20${result.registrationId}%0AChess.com%20Username:%20${result.chessUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] text-slate-950 font-bold text-xs hover:bg-[#20bd5a]"
                >
                  <span>Send Details on WhatsApp Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* UNLOCKED CLUB INSTRUCTIONS & LINK (Visible when VERIFIED) */}
            {result.verificationStatus === 'VERIFIED' && result.chessClub && (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/40 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-lg">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Verified: Private Chess.com Club Access Unlocked</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <p className="font-bold text-white">Follow these exact instructions to join:</p>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 whitespace-pre-line font-sans leading-relaxed text-slate-300">
                    {result.chessClub.instructions}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={result.chessClub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Open Private Chess.com Club ({result.chessClub.name})</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={copyClubLink}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>Copy Club Link</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
