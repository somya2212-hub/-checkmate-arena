import React from 'react';
import { UserPlus, UserCheck, CreditCard, Key, MessageCircle, ShieldCheck, MailCheck, UserCheck2, Trophy, ArrowDown } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      num: 1,
      title: 'Register for Tournament',
      desc: 'Select the active tournament on Checkmate Arena and begin your application.',
      icon: UserPlus,
      color: 'from-amber-500 to-amber-700',
    },
    {
      num: 2,
      title: 'Enter Chess.com Details',
      desc: 'Provide your accurate Chess.com username and contact details. No password needed.',
      icon: UserCheck,
      color: 'from-amber-600 to-amber-800',
    },
    {
      num: 3,
      title: 'Pay Entry Fee Online',
      desc: 'Complete payment securely via UPI, Cards, or NetBanking powered by Razorpay.',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-700',
    },
    {
      num: 4,
      title: 'Receive Unique Registration ID',
      desc: 'Get your permanent unique ID (e.g. CA-8F42K7) generated cryptographically by our backend.',
      icon: Key,
      highlight: 'CA-8F42K7',
      color: 'from-emerald-500 to-emerald-700',
    },
    {
      num: 5,
      title: 'Send Details on WhatsApp',
      desc: 'Click "Verify on WhatsApp" to forward your Registration ID and Chess.com username to the organizer.',
      icon: MessageCircle,
      color: 'from-emerald-600 to-teal-800',
    },
    {
      num: 6,
      title: 'Arbiter Verification',
      desc: 'Our team verifies your payment, registered username, and Fair Play eligibility.',
      icon: ShieldCheck,
      color: 'from-purple-500 to-purple-700',
    },
    {
      num: 7,
      title: 'Receive Private Club Invite',
      desc: 'Follow the private Chess.com club joining link & instructions unlocked upon verification.',
      icon: MailCheck,
      color: 'from-indigo-500 to-indigo-700',
    },
    {
      num: 8,
      title: 'Organizer Club Approval',
      desc: 'Organizers cross-check your club request against verified paid records and approve entry.',
      icon: UserCheck2,
      color: 'from-cyan-500 to-cyan-700',
    },
    {
      num: 9,
      title: 'Play & Win Prizes',
      desc: 'Join the Swiss lobby 15 min prior, compete across 7 rounds, and claim official prizes!',
      icon: Trophy,
      color: 'from-amber-400 to-yellow-600',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Transparent Workflow
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From registration to checkmate: a strict 9-step verified pipeline ensuring fair, bot-free, and guaranteed online chess competition.
          </p>
        </div>

        {/* 9-Step Grid / Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-amber-500/40 transition-all duration-200 hover:-translate-y-1 relative group flex flex-col justify-between"
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-slate-950 stroke-[2.2]" />
                  </div>
                  <span className="font-mono text-xs font-black text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
                    STEP {step.num.toString().padStart(2, '0')}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>

                  {step.highlight && (
                    <div className="mt-3 p-2 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-xs text-center text-amber-400 font-bold">
                      Example: {step.highlight}
                    </div>
                  )}
                </div>

                {/* Arrow indicator on mobile or end */}
                <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Phase {Math.ceil(step.num / 3)}: {step.num <= 3 ? 'Registration' : step.num <= 6 ? 'Verification' : 'Tournament Arena'}</span>
                  {idx < steps.length - 1 && (
                    <span className="text-amber-500/60 font-bold">↓ Next</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
