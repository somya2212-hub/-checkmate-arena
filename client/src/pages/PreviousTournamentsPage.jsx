import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Calendar, Users, ExternalLink, ArrowRight } from 'lucide-react';
import { getPreviousTournaments } from '../services/api';

export const PreviousTournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPreviousTournaments()
      .then((res) => {
        if (res.data.success) setTournaments(res.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen py-12 relative chess-pattern-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Hall of Fame
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Previous Tournaments & Results
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Official archives of past Checkmate Arena championships, final standings, verified prize winners, and Chess.com game records.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading tournament archives...</span>
          </div>
        ) : tournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournaments.map((t) => (
              <div key={t._id} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">{t.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t.date} • {t.timeControl}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    COMPLETED
                  </span>
                </div>

                {t.results?.isPublished && (
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Podium Winners
                    </span>
                    
                    <div className="space-y-2 text-xs">
                      {t.results.winner && (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <span className="font-bold text-amber-300 flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            1st Place (Champion)
                          </span>
                          <span className="font-mono font-bold text-white">{t.results.winner}</span>
                        </div>
                      )}

                      {t.results.runnerUp && (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="font-bold text-slate-300 flex items-center gap-1.5">
                            <Medal className="w-3.5 h-3.5 text-slate-400" />
                            2nd Place (Runner-up)
                          </span>
                          <span className="font-mono font-bold text-slate-300">{t.results.runnerUp}</span>
                        </div>
                      )}

                      {t.results.thirdPlace && (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="font-bold text-amber-700 flex items-center gap-1.5">
                            <Medal className="w-3.5 h-3.5 text-amber-700" />
                            3rd Place
                          </span>
                          <span className="font-mono font-bold text-slate-300">{t.results.thirdPlace}</span>
                        </div>
                      )}
                    </div>

                    {t.results.summary && (
                      <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                        {t.results.summary}
                      </p>
                    )}
                  </div>
                )}

                {t.results?.standingsUrl && (
                  <a
                    href={t.results.standingsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    <span>View Complete Chess.com Cross-Table Standings</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              No Past Tournaments Yet
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Results from completed Checkmate Arena tournaments will appear here.
            </p>
            <p className="text-[11px] text-slate-500">
              Season 1 is currently in registration phase. Official leaderboards and standings will be permanently archived here upon tournament conclusion.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
