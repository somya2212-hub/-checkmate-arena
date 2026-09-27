import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award, ShieldCheck, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { getFeaturedTournament } from '../services/api';
import { PrizePoolSection } from '../components/PrizePoolSection';

export const PrizePoolPage = () => {
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    getFeaturedTournament()
      .then((res) => {
        if (res.data.success) setTournament(res.data.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen py-12 relative chess-pattern-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Official Prize Table
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Prize Pool & Distribution Policy
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Checkmate Arena ensures 100% transparent and verified prize distribution. Never miss a payout.
          </p>
        </div>

        {/* Prize Section Component */}
        <PrizePoolSection tournament={tournament} />

        {/* Payout & Terms Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Payout Timeline & Verification</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>24-Hour Fair Play Clearance:</strong> Prize distribution begins 24 hours post-tournament to allow thorough anti-cheat screening by Chess.com and our arbiters.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Instant UPI / Bank Transfer:</strong> Winners are contacted directly via their verified WhatsApp and email to submit their payout UPI ID.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Public Verification Proof:</strong> All prize distributions are cataloged in our tournament archives with transaction confirmations.</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Tie-Break & Split Rules</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Buchholz Cut 1:</strong> Primary tie-break system calculated automatically by Chess.com tournament engine.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Sonneborn-Berger:</strong> Secondary tie-break calculation in case of identical Buchholz score.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>No Shared Prizes:</strong> Exact standing determined by official tie-break points so that every place receives its allocated prize.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="glass-panel-gold p-8 rounded-3xl text-center max-w-2xl mx-auto space-y-4 border border-amber-500/30">
          <h3 className="font-display font-bold text-2xl text-white">
            Ready to Compete for the Championship?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Secure your spot in the upcoming Checkmate Arena tournament before registrations close.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg"
            >
              <span>Register for Tournament Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
