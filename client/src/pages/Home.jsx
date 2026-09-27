import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Trophy, Calendar, Clock, Users, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { getFeaturedTournament, getPreviousTournaments } from '../services/api';
import { TournamentCard } from '../components/TournamentCard';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { PrizePoolSection } from '../components/PrizePoolSection';
import { TrustSection } from '../components/TrustSection';

export const Home = () => {
  const [tournament, setTournament] = useState(null);
  const [pastTournaments, setPastTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredRes, pastRes] = await Promise.all([
          getFeaturedTournament(),
          getPreviousTournaments(),
        ]);
        if (featuredRes.data.success) {
          setTournament(featuredRes.data.data);
        }
        if (pastRes.data.success) {
          setPastTournaments(pastRes.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const registeredCount = tournament?.registeredCount || 0;
  const maxParticipants = tournament?.maxParticipants || 128;

  return (
    <div className="min-h-screen relative chess-pattern-bg">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0 chess-grid-glow pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-widest animate-pulse">
              <Crown className="w-4 h-4" />
              <span>Official Checkmate Arena Championship</span>
            </div>

            {/* Main Hero Header */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-none">
              CHECKMATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">ARENA</span>
            </h1>

            <p className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-300 tracking-tight">
              Competitive Online Chess Tournaments
            </p>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Play structured, arbiter-verified Swiss Rapid tournaments hosted in our private Chess.com club. Guaranteed prize payouts, strict fair-play monitoring, and zero bots.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Register Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/tournament"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base text-slate-200 bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 transition-all flex items-center justify-center gap-2"
              >
                <span>View Tournament Details</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Hero Feature Highlights */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
              <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 font-medium">Prize Pool</span>
                <p className="font-display font-black text-base text-amber-400">
                  {tournament ? `₹${tournament.prizePool.toLocaleString()}` : '₹10,000'}
                </p>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 font-medium">Time Control</span>
                <p className="font-display font-bold text-xs sm:text-sm text-white">
                  {tournament?.timeControl || '10+0 Rapid'}
                </p>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 font-medium">Format</span>
                <p className="font-display font-bold text-xs sm:text-sm text-white">
                  {tournament?.format || 'Swiss System'}
                </p>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 font-medium">Active Players</span>
                <p className="font-display font-bold text-xs sm:text-sm text-emerald-400">
                  {registeredCount} / {maxParticipants} Paid
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING TOURNAMENT CARD */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-1">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            Next Event
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Upcoming Championship
          </h2>
        </div>

        {tournament ? (
          <TournamentCard tournament={tournament} />
        ) : (
          <div className="glass-panel p-8 rounded-2xl text-center text-slate-400">
            {loading ? 'Loading upcoming tournament details...' : 'No active tournaments at the moment.'}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <HowItWorksSection />

      {/* PRIZE POOL */}
      <PrizePoolSection tournament={tournament} />

      {/* WHY PLAY AT CHECKMATE ARENA */}
      <TrustSection />

      {/* TOURNAMENT FORMAT & IMPORTANT RULES PREVIEW */}
      <section className="py-20 bg-[#07090e] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Format Column */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Tournament Architecture
              </span>
              <h2 className="font-display text-3xl font-black text-white">
                Standard Swiss System on Private Chess.com Club
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Checkmate Arena tournaments follow official FIDE/Chess.com Swiss Pairing protocols. No players are eliminated early—everyone plays all 7 rounds regardless of win/loss record.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Exact Username Matching</h4>
                    <p className="text-xs text-slate-400">You must play using the exact Chess.com username registered on your pass.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Mandatory Check-in</h4>
                    <p className="text-xs text-slate-400">Check in 15 minutes before 06:00 PM IST inside the tournament lobby.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Automated Anti-Cheat Analysis</h4>
                    <p className="text-xs text-slate-400">Strict zero-tolerance policy against engine assistance or account sharing.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/rules"
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300"
                >
                  <span>Read Complete Tournament & Fair Play Rules</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="font-display font-bold text-lg text-white">
                  Quick Tournament Overview
                </h3>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  Season 1
                </span>
              </div>

              <dl className="space-y-4 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <dt className="text-slate-400">Platform</dt>
                  <dd className="font-semibold text-white">Chess.com (Private Club)</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <dt className="text-slate-400">Time Control</dt>
                  <dd className="font-semibold text-white">{tournament?.timeControl || '10 min + 0 sec (Rapid)'}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <dt className="text-slate-400">Number of Rounds</dt>
                  <dd className="font-semibold text-white">{tournament?.roundsCount || 7} Rounds</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <dt className="text-slate-400">Entry Fee</dt>
                  <dd className="font-semibold text-amber-400">₹{tournament?.entryFee || 199}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <dt className="text-slate-400">Total Prize Pool</dt>
                  <dd className="font-bold text-amber-400">₹{tournament?.prizePool?.toLocaleString() || '10,000'}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-slate-400">Organizer</dt>
                  <dd className="font-semibold text-slate-200">Hosted by Checkmate Arena</dd>
                </div>
              </dl>

              <Link
                to="/register"
                className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Registration</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* PREVIOUS TOURNAMENTS SECTION */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
              Tournament Archive
            </span>
            <h2 className="font-display text-3xl font-bold text-white">
              Previous Tournament Results
            </h2>
          </div>

          {pastTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTournaments.map((past) => (
                <div key={past._id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-base">{past.title}</h3>
                      <p className="text-xs text-slate-400">{past.date}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      COMPLETED
                    </span>
                  </div>
                  {past.results?.winner && (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-amber-400 font-bold">🥇 Champion:</span>
                        <span className="font-mono text-white">{past.results.winner}</span>
                      </div>
                      {past.results?.runnerUp && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">🥈 Runner-up:</span>
                          <span className="font-mono text-slate-300">{past.results.runnerUp}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {past.results?.standingsUrl && (
                    <a
                      href={past.results.standingsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      <span>View Official Chess.com Standings</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center max-w-xl mx-auto space-y-3">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">
                Results from completed Checkmate Arena tournaments will appear here.
              </p>
              <p className="text-xs text-slate-500">
                Once Season 1 concludes, official verified rankings, game archives, and prize distribution proofs will be cataloged publicly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="py-16 bg-[#07090e] border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <HelpCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Have Questions About Tournament Process?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Find answers on club invites, Swiss pairings, prize disbursement timelines, and WhatsApp verification.
          </p>
          <div className="pt-2">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white hover:border-amber-500/50 transition-colors"
            >
              <span>Explore Complete FAQ Knowledge Base</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
