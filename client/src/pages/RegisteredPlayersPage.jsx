import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck, Clock, User, Filter, AlertCircle } from 'lucide-react';
import { getPublicRegisteredPlayers } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const RegisteredPlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await getPublicRegisteredPlayers('all');
        if (res.data.success) {
          setPlayers(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching registered players:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.chessUsername.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'VERIFIED' && p.verificationStatus === 'VERIFIED') ||
      (filterStatus === 'PENDING' && p.verificationStatus === 'PENDING') ||
      (filterStatus === 'APPROVED' && p.clubStatus === 'APPROVED');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen py-12 relative chess-pattern-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Public Tournament Roster
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Registered Players
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Live database roster of verified paid participants. Private contact details and registration IDs are kept strictly confidential.
          </p>
        </div>

        {/* Stats & Search Bar */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Chess.com handle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterStatus === 'ALL'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                All ({players.length})
              </button>
              <button
                onClick={() => setFilterStatus('VERIFIED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterStatus === 'VERIFIED'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Verified ({players.filter((p) => p.verificationStatus === 'VERIFIED').length})
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterStatus === 'PENDING'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Pending Verification ({players.filter((p) => p.verificationStatus === 'PENDING').length})
              </button>
            </div>
          </div>
        </div>

        {/* Players List Table */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading registered player roster...</span>
            </div>
          ) : filteredPlayers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4"># Seed</th>
                    <th className="px-6 py-4">Chess.com Username</th>
                    <th className="px-6 py-4">Verification Status</th>
                    <th className="px-6 py-4">Club Access Status</th>
                    <th className="px-6 py-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPlayers.map((player) => (
                    <tr key={player.seed} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-400">
                        #{player.seed.toString().padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                            {player.chessUsername.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-mono font-bold text-white text-sm">
                            {player.chessUsername}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge type="verification" status={player.verificationStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge type="club" status={player.clubStatus} />
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-[11px]">
                        {new Date(player.registeredAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="font-semibold text-slate-300 text-sm">
                {searchTerm ? 'No registered player matched your search query.' : 'No registrations confirmed yet.'}
              </p>
              <p className="text-xs text-slate-500">
                Be the first to secure your seed in the championship arena!
              </p>
            </div>
          )}
        </div>

        {/* Privacy Note */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
          <p>
            🛡️ Checkmate Arena Privacy Guarantee: Registration IDs, personal contact numbers, emails, and transaction receipts are never published on the public roster.
          </p>
        </div>

      </div>
    </div>
  );
};
