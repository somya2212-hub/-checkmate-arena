import React from 'react';
import { Trophy, Award, Medal, ShieldCheck } from 'lucide-react';

export const PrizePoolSection = ({ tournament }) => {
  const defaultPrizes = [
    { place: '1st Place (Champion)', amount: 5000, badge: 'gold', description: 'Winner Trophy + Cash Prize' },
    { place: '2nd Place (Runner-up)', amount: 3000, badge: 'silver', description: 'Silver Medal + Cash Prize' },
    { place: '3rd Place', amount: 1500, badge: 'bronze', description: 'Bronze Medal + Cash Prize' },
    { place: 'Best Under-1600 Rating', amount: 500, badge: 'medal', description: 'Category Rating Cash Prize' },
  ];

  const prizes = tournament?.prizeDistribution?.length > 0 ? tournament.prizeDistribution : defaultPrizes;
  const totalPrize = tournament?.prizePool || 10000;

  return (
    <section className="py-20 bg-[#07090e] border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Guaranteed Rewards
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tournament Prize Distribution
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Total Prize Pool: <span className="text-amber-400 font-bold font-display text-lg">₹{totalPrize.toLocaleString()}</span>. All cash prizes are distributed transparently via UPI / Bank Transfer within 24 hours of final arbiter verification.
          </p>
        </div>

        {/* Prize Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {prizes.map((p, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            let borderStyle = 'border-slate-800';
            let bgStyle = 'bg-slate-900/60';
            let iconColor = 'text-amber-400';
            let medalBg = 'bg-slate-800';

            if (isFirst) {
              borderStyle = 'border-amber-500/60 shadow-xl shadow-amber-500/10';
              bgStyle = 'bg-gradient-to-b from-amber-500/15 via-slate-900/80 to-slate-900/90';
              iconColor = 'text-amber-300';
              medalBg = 'bg-amber-500 text-slate-950';
            } else if (isSecond) {
              borderStyle = 'border-slate-400/40';
              bgStyle = 'bg-gradient-to-b from-slate-400/10 to-slate-900/80';
              iconColor = 'text-slate-300';
              medalBg = 'bg-slate-300 text-slate-950';
            } else if (isThird) {
              borderStyle = 'border-amber-700/40';
              bgStyle = 'bg-gradient-to-b from-amber-700/10 to-slate-900/80';
              iconColor = 'text-amber-600';
              medalBg = 'bg-amber-700 text-white';
            }

            return (
              <div
                key={idx}
                className={`rounded-2xl p-6 border ${borderStyle} ${bgStyle} flex flex-col justify-between text-center relative group hover:-translate-y-1 transition-transform`}
              >
                {/* Top Medal Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${medalBg} flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                    {isFirst ? (
                      <Trophy className="w-7 h-7 stroke-[2.2]" />
                    ) : isSecond || isThird ? (
                      <Medal className="w-7 h-7 stroke-[2.2]" />
                    ) : (
                      <Award className="w-7 h-7 stroke-[2.2]" />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {p.place}
                  </h3>
                  <div className="font-display font-black text-3xl text-amber-400 mb-2">
                    ₹{p.amount.toLocaleString()}
                  </div>
                  {p.description && (
                    <p className="text-xs text-slate-400">
                      {p.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct UPI Transfer</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prize Pool Disclaimers */}
        <div className="mt-12 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">
            Fair Play & Disqualification Clause:
          </p>
          <p>
            Prize winners must be in good standing with Chess.com fair play algorithms. Any account flagged or banned during/post-tournament forfeits prize eligibility.
          </p>
        </div>
      </div>
    </section>
  );
};
