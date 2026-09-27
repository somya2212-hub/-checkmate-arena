import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Trophy, Users, Shield, ArrowRight, Zap, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { getFeaturedTournament } from '../services/api';

export const TournamentDetails = () => {
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getFeaturedTournament();
        if (res.data.success) {
          setTournament(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load tournament details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading tournament data...</span>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen py-24 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">No Active Tournament Found</h2>
        <p className="text-slate-400 text-sm mb-6">Check back soon for the next tournament announcement.</p>
        <Link to="/" className="px-6 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm">
          Return to Home
        </Link>
      </div>
    );
  }

  const registered = tournament.registeredCount || 0;
  const max = tournament.maxParticipants || 128;
  const spotsLeft = tournament.spotsLeft || Math.max(0, max - registered);

  return (
    <div className="min-h-screen py-12 relative chess-pattern-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="glass-panel-gold p-8 sm:p-12 rounded-3xl border border-amber-500/30 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
              Official Tournament Specification
            </span>
            <span className="text-xs text-slate-300 bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800">
              Hosted by Checkmate Arena
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            {tournament.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-8">
            {tournament.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400">Entry Fee</span>
              <p className="font-display font-black text-2xl text-amber-400">₹{tournament.entryFee}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Prize Pool</span>
              <p className="font-display font-black text-2xl text-amber-400">₹{tournament.prizePool.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Capacity</span>
              <p className="font-display font-bold text-lg text-white">{registered} / {max} Players</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Spots Left</span>
              <p className="font-display font-bold text-lg text-emerald-400">{spotsLeft} Available</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>Register for Tournament (₹{tournament.entryFee})</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/players"
              className="w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900 border border-slate-700 text-center"
            >
              View Registered Players Roster
            </Link>
          </div>
        </div>

        {/* Deep Schedule & Format Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Format Card */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Tournament Format & Time Controls</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">Pairing System</span>
                  <span className="font-bold text-white text-base">{tournament.format}</span>
                  <p className="text-xs text-slate-400 mt-1">Swiss system pairing ensures all players play every round regardless of score.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">Time Control</span>
                  <span className="font-bold text-white text-base">{tournament.timeControl}</span>
                  <p className="text-xs text-slate-400 mt-1">10 minutes per player with zero increment. Official Chess.com clock timing.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">Rounds Scheduled</span>
                  <span className="font-bold text-white text-base">{tournament.roundsCount || 7} Rounds</span>
                  <p className="text-xs text-slate-400 mt-1">Continuous rounds with a 2-minute break between rounds.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">Platform</span>
                  <span className="font-bold text-white text-base">Private Chess.com Club</span>
                  <p className="text-xs text-slate-400 mt-1">Verified invite only. Spectators and unverified accounts are barred.</p>
                </div>
              </div>
            </div>

            {/* Tie-Breaks & Rules */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>Rules & Anti-Cheating Protocol</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Consistent Username:</strong> You must play only with the registered Chess.com username. Any other account will be rejected from the private club lobby.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Anti-Cheat Surveillance:</strong> Games are continuously analyzed by Chess.com cheat detection systems and post-match arbiter review.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Disconnections:</strong> Players are responsible for stable network connections. Timed-out games stand as official losses.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/rules" className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1">
                  Read full rules documentation →
                </Link>
              </div>
            </div>

          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            
            {/* Key Schedule Dates */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Key Tournament Dates</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Tournament Date</span>
                  <p className="font-bold text-white text-sm">{tournament.date}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Start Time</span>
                  <p className="font-bold text-white text-sm">{tournament.startTime} {tournament.timeZone}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Registration Deadline</span>
                  <p className="font-bold text-amber-400 text-xs">{tournament.registrationDeadline}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Mandatory Lobby Check-In</span>
                  <p className="font-bold text-emerald-400 text-xs">15 minutes before Round 1 start</p>
                </div>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-display font-bold text-sm text-white">
                Tournament Organizer Inquiries
              </h4>
              <p className="text-slate-400 leading-relaxed">
                For questions regarding rating categories, WhatsApp verification, or group registrations, contact our arbiter team.
              </p>
              <Link
                to="/contact"
                className="inline-block font-bold text-amber-400 hover:text-amber-300"
              >
                Contact Support Desk →
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
