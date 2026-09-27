import React from 'react';
import { ShieldCheck, Lock, Key, UserCheck, ScrollText, Trophy, Club, Headphones, History } from 'lucide-react';

export const TrustSection = () => {
  const trustPoints = [
    {
      title: 'Secure Online Registration',
      desc: 'Clean, validated application flow ensuring authentic Chess.com username mapping.',
      icon: Lock,
    },
    {
      title: 'Instant Payment Confirmation',
      desc: 'Powered by encrypted Razorpay gateway with immediate cryptographic payment verification.',
      icon: ShieldCheck,
    },
    {
      title: 'Unique Registration ID',
      desc: 'Non-sequential, permanent ID (e.g. CA-XXXXXX) issued for every verified participant.',
      icon: Key,
    },
    {
      title: 'Manual Player Verification',
      desc: 'Arbiter cross-checks registration IDs and Chess.com usernames via WhatsApp before granting access.',
      icon: UserCheck,
    },
    {
      title: 'Transparent Tournament Rules',
      desc: 'Standardized Swiss system rules, time controls, and anti-cheating guidelines published upfront.',
      icon: ScrollText,
    },
    {
      title: 'Published Prize Distribution',
      desc: 'Clear, guaranteed prize breakdown with fast disbursement to verified winners.',
      icon: Trophy,
    },
    {
      title: 'Private Chess.com Club',
      desc: 'Only paid and verified participants are admitted into the official tournament arena.',
      icon: Club,
    },
    {
      title: 'Dedicated WhatsApp Support',
      desc: 'Direct line to tournament organizers for queries, check-in help, and emergency assistance.',
      icon: Headphones,
    },
    {
      title: 'Public Results & Standings',
      desc: 'Official standings, winner leaderboards, and Chess.com tournament links archived after every event.',
      icon: History,
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Platform Integrity
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            Why Play at Checkmate Arena?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Engineered for serious chess players who demand high integrity, prompt payouts, and professional tournament management.
          </p>
        </div>

        {/* Features 3x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors flex items-start gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all text-amber-400">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base mb-1 group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
