import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Trophy, Users, Shield, ArrowRight, Zap, Award } from 'lucide-react';

export const TournamentCard = ({ tournament }) => {
  if (!tournament) return null;

  const registered = tournament.registeredCount || 0;
  const max = tournament.maxParticipants || 128;
  const fillPct = Math.min(100, Math.round((registered / max) * 100));

  const isClosed = tournament.status === 'REGISTRATION_CLOSED' || registered >= max;

  return (
    <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-amber-500/30">
      
      {/* Background chess watermarks */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            {tournament.status === 'REGISTRATION_OPEN' ? 'Registrations Open' : tournament.status.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Entry Fee:</span>
          <span className="font-display font-black text-2xl text-amber-400">
            ₹{tournament.entryFee}
          </span>
        </div>
      </div>

      {/* Title & Tagline */}
      <div className="py-6 space-y-2">
        <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
          {tournament.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          {tournament.tagline || tournament.description}
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Date</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-white">{tournament.date}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Time Control</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-white">{tournament.timeControl}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Format</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-white">{tournament.format}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Total Prize Pool</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-amber-400">₹{tournament.prizePool.toLocaleString()}</p>
        </div>
      </div>

      {/* Live Capacity Meter (Real DB count) */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            Registered Players (Database Source of Truth):
          </span>
          <span className="font-mono font-bold text-white">
            <span className="text-amber-400">{registered}</span> / {max} Players ({tournament.spotsLeft || Math.max(0, max - registered)} spots remaining)
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Deadline: {tournament.registrationDeadline}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <Link
          to={`/register?tournament=${tournament.slug || tournament._id}`}
          className={`w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 transition-all ${
            isClosed
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5'
          }`}
        >
          <span>{isClosed ? 'Registrations Closed' : 'Register Now (₹' + tournament.entryFee + ')'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/tournament"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-colors text-center"
        >
          View Full Tournament Details
        </Link>
      </div>
    </div>
  );
};
