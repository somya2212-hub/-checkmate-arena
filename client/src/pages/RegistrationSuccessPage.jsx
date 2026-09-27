import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Copy, Check, Printer, Shield, ArrowRight, ExternalLink } from 'lucide-react';

export const RegistrationSuccessPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Read from session storage
    const stored = sessionStorage.getItem('ca_success_registration');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed);

        // Fire confetti celebration
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#eab308', '#f59e0b', '#10b981', '#ffffff'],
          });
        } catch {
          // ignore if canvas blocked
        }
      } catch (err) {
        console.error('Error parsing stored registration:', err);
      }
    }
  }, []);

  const handleCopyId = () => {
    if (data?.registrationId) {
      navigator.clipboard.writeText(data.registrationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!data) {
    return (
      <div className="min-h-screen py-24 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">No Active Registration Session</h2>
        <p className="text-slate-400 text-sm mb-6">
          If you have already registered, you can look up your registration status anytime.
        </p>
        <div className="flex gap-4">
          <Link to="/verify" className="px-6 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm">
            Check Registration Status
          </Link>
          <Link to="/" className="px-6 py-2.5 rounded-lg bg-slate-800 text-white font-semibold text-sm">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 relative chess-pattern-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
            🎉 Registration Successful
          </span>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Welcome to Checkmate Arena
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Your payment was confirmed successfully. Below is your official tournament pass and unique Registration ID.
          </p>
        </div>

        {/* Official Tournament Pass Card */}
        <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl relative overflow-hidden space-y-6 print:border-slate-800">
          
          {/* Top Pass Banner */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                Official Entry Pass
              </span>
              <h3 className="font-display font-black text-lg text-white">
                {data.tournamentTitle}
              </h3>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PAID CONFIRMED
              </span>
            </div>
          </div>

          {/* Registration ID Highlight Box */}
          <div className="bg-slate-950/90 rounded-2xl p-5 border border-amber-500/30 text-center space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Your Unique Registration ID
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono font-black text-3xl sm:text-4xl text-amber-400 tracking-wider">
                {data.registrationId}
              </span>
              <button
                onClick={handleCopyId}
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/50 transition-colors"
                title="Copy Registration ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-amber-300/80">
              Save your Registration ID. You will need it for verification and tournament entry.
            </p>
          </div>

          {/* Registration Summary Table */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <dt className="text-slate-400">Chess.com Username</dt>
              <dd className="font-mono font-bold text-sm text-white">{data.chessUsername}</dd>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <dt className="text-slate-400">Player Name</dt>
              <dd className="font-bold text-sm text-white">{data.fullName}</dd>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <dt className="text-slate-400">Amount Paid</dt>
              <dd className="font-bold text-sm text-amber-400">₹{data.amountPaid}</dd>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <dt className="text-slate-400">Verification Status</dt>
              <dd className="font-semibold text-xs text-amber-400 flex items-center gap-1">
                <span>Pending WhatsApp Check</span>
              </dd>
            </div>
          </dl>

          {/* Step 5 Primary CTA: WhatsApp Verification */}
          <div className="pt-2 space-y-3">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs space-y-2">
              <p className="font-bold text-emerald-200">Next Mandatory Step: Send Details on WhatsApp</p>
              <p>
                Click below to send your Registration ID ({data.registrationId}) and Chess.com username ({data.chessUsername}) to the tournament arbiter. Once verified, you will receive the private Chess.com club access.
              </p>
            </div>

            <a
              href={data.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-xl font-bold text-base text-slate-950 bg-[#25D366] hover:bg-[#20bd5a] shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <MessageCircle className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>Verify on WhatsApp</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Print & Status Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto flex-1 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Pass (PDF)</span>
            </button>

            <Link
              to="/verify"
              className="w-full sm:w-auto flex-1 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-2 text-center"
            >
              <span>Check Verification Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
