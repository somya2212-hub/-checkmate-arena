import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  Edit,
  Trophy,
  History,
  Check,
  Eye,
  MessageCircle,
  Plus,
  Save,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getDashboardStats,
  getAdminRegistrations,
  manualVerifyPlayer,
  updateClubAccessStatus,
  rejectOrRefundRegistration,
  getAdminAuditLogs,
  adminGetAllTournaments,
  adminUpdateTournament,
  adminPublishResults,
} from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const AdminDashboardPage = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'registrations' | 'manual-verify' | 'tournaments' | 'results' | 'audit'
  const [activeTab, setActiveTab] = useState('registrations');

  // Stats & Data
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterPayment, setFilterPayment] = useState('ALL');
  const [filterVerification, setFilterVerification] = useState('ALL');
  const [filterClub, setFilterClub] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Manual WhatsApp Verification Form State
  const [verifyRegId, setVerifyRegId] = useState('');
  const [verifyChessUsername, setVerifyChessUsername] = useState('');
  const [verifyNotes, setVerifyNotes] = useState('');
  const [manualVerifyLoading, setManualVerifyLoading] = useState(false);
  const [verifyResultMsg, setVerifyResultMsg] = useState({ type: '', text: '' });

  // Modals & Action States
  const [selectedReg, setSelectedReg] = useState(null);
  const [actionModal, setActionModal] = useState({ open: false, regId: null, action: 'REJECT', reason: '' });

  // Tournament Edit State
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournamentForm, setTournamentForm] = useState(null);
  const [tournamentSavedMsg, setTournamentSavedMsg] = useState('');

  // Results Publish State
  const [resultsForm, setResultsForm] = useState({
    winner: '',
    runnerUp: '',
    thirdPlace: '',
    standingsUrl: '',
    summary: '',
    setStatusCompleted: false,
  });
  const [resultsSavedMsg, setResultsSavedMsg] = useState('');

  useEffect(() => {
    loadAllDashboardData();
  }, [page, filterPayment, filterVerification, filterClub, search]);

  const loadAllDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, regRes, tourneyRes, logsRes] = await Promise.all([
        getDashboardStats(),
        getAdminRegistrations({
          page,
          limit: 25,
          search,
          paymentStatus: filterPayment,
          verificationStatus: filterVerification,
          clubStatus: filterClub,
        }),
        adminGetAllTournaments(),
        getAdminAuditLogs(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (regRes.data.success) {
        setRegistrations(regRes.data.data);
        setTotalPages(regRes.data.pages || 1);
      }
      if (tourneyRes.data.success) {
        setTournaments(tourneyRes.data.data);
        if (tourneyRes.data.data.length > 0 && !selectedTournament) {
          const featured = tourneyRes.data.data[0];
          setSelectedTournament(featured);
          setTournamentForm({ ...featured });
          if (featured.results) {
            setResultsForm({
              winner: featured.results.winner || '',
              runnerUp: featured.results.runnerUp || '',
              thirdPlace: featured.results.thirdPlace || '',
              standingsUrl: featured.results.standingsUrl || '',
              summary: featured.results.summary || '',
              setStatusCompleted: featured.status === 'COMPLETED',
            });
          }
        }
      }
      if (logsRes.data.success) setAuditLogs(logsRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Manual WhatsApp Verification Handler
  const handleManualVerify = async (e) => {
    e.preventDefault();
    if (!verifyRegId.trim()) return;

    setManualVerifyLoading(true);
    setVerifyResultMsg({ type: '', text: '' });

    try {
      const res = await manualVerifyPlayer({
        registrationId: verifyRegId.trim(),
        chessUsername: verifyChessUsername.trim(),
        notes: verifyNotes.trim() || 'Verified via WhatsApp cross-check',
      });

      if (res.data.success) {
        setVerifyResultMsg({
          type: 'success',
          text: res.data.message || 'Player verified successfully!',
        });
        setVerifyRegId('');
        setVerifyChessUsername('');
        setVerifyNotes('');
        loadAllDashboardData();
      } else {
        setVerifyResultMsg({
          type: 'error',
          text: res.data.message || 'Verification failed.',
        });
      }
    } catch (err) {
      setVerifyResultMsg({
        type: 'error',
        text: err.response?.data?.message || 'Error executing verification.',
      });
    } finally {
      setManualVerifyLoading(false);
    }
  };

  // 2. Direct Table Quick Action: Verify Player
  const handleQuickVerify = async (regId, chessUsername) => {
    try {
      const res = await manualVerifyPlayer({
        registrationId: regId,
        chessUsername,
        notes: 'One-click verification from admin dashboard',
      });
      if (res.data.success) {
        loadAllDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    }
  };

  // 3. Direct Table Quick Action: Approve Club Access
  const handleApproveClub = async (mongoId) => {
    try {
      const res = await updateClubAccessStatus(mongoId, {
        clubStatus: 'APPROVED',
      });
      if (res.data.success) {
        loadAllDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update club access');
    }
  };

  // 4. Reject / Refund Handler
  const handleExecuteAction = async () => {
    if (!actionModal.regId) return;
    try {
      const res = await rejectOrRefundRegistration(actionModal.regId, {
        action: actionModal.action,
        reason: actionModal.reason,
      });
      if (res.data.success) {
        setActionModal({ open: false, regId: null, action: 'REJECT', reason: '' });
        loadAllDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  // 5. Save Tournament Updates
  const handleSaveTournament = async (e) => {
    e.preventDefault();
    if (!selectedTournament?._id) return;

    try {
      const res = await adminUpdateTournament(selectedTournament._id, tournamentForm);
      if (res.data.success) {
        setTournamentSavedMsg('Tournament configuration updated successfully!');
        setTimeout(() => setTournamentSavedMsg(''), 3000);
        loadAllDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save tournament changes');
    }
  };

  // 6. Save Published Results
  const handlePublishResults = async (e) => {
    e.preventDefault();
    if (!selectedTournament?._id) return;

    try {
      const res = await adminPublishResults(selectedTournament._id, {
        ...resultsForm,
        isPublished: true,
      });
      if (res.data.success) {
        setResultsSavedMsg('Tournament results and standings published publicly!');
        setTimeout(() => setResultsSavedMsg(''), 3000);
        loadAllDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish results');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-20">
      
      {/* Admin Navigation Bar */}
      <header className="bg-[#0b0f17] border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-display font-black text-base text-white">
                  Checkmate Arena <span className="text-amber-400">Admin Control</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-mono">
                  Organizer: {admin?.name || 'Lead Organizer'} ({admin?.role || 'SUPER_ADMIN'})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadAllDashboardData}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Top Key Metrics Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Total Revenue</span>
              <p className="font-display font-black text-xl text-amber-400">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Paid Confirmed</span>
              <p className="font-display font-black text-xl text-emerald-400">
                {stats.successfulPayments}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Pending WhatsApp</span>
              <p className="font-display font-black text-xl text-amber-400">
                {stats.pendingVerification}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Verified Players</span>
              <p className="font-display font-black text-xl text-emerald-400">
                {stats.verifiedPlayers}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Club Approved</span>
              <p className="font-display font-black text-xl text-cyan-400">
                {stats.clubApproved}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Capacity Utilized</span>
              <p className="font-display font-black text-xl text-white">
                {stats.capacityFilledPercentage}% ({stats.successfulPayments}/{stats.tournamentCapacity})
              </p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'registrations'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registrations Roster</span>
          </button>

          <button
            onClick={() => setActiveTab('manual-verify')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'manual-verify'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Manual Verify</span>
          </button>

          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tournaments'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Tournament Management</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'results'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Publish Results</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Logs</span>
          </button>
        </div>

        {/* TAB 1: REGISTRATIONS ROSTER & MANAGEMENT */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            
            {/* Search & Status Filters */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, Username, Email, Phone..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Status Selectors */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
                >
                  <option value="ALL">Payment: All</option>
                  <option value="PAID">PAID</option>
                  <option value="PENDING">PENDING</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>

                <select
                  value={filterVerification}
                  onChange={(e) => setFilterVerification(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
                >
                  <option value="ALL">Verification: All</option>
                  <option value="PENDING">Verification: Pending</option>
                  <option value="VERIFIED">Verification: Verified</option>
                  <option value="REJECTED">Verification: Rejected</option>
                </select>

                <select
                  value={filterClub}
                  onChange={(e) => setFilterClub(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
                >
                  <option value="ALL">Club: All</option>
                  <option value="APPROVED">Club: Approved</option>
                  <option value="JOIN_PENDING">Club: Join Pending</option>
                  <option value="NOT_APPLIED">Club: Not Applied</option>
                </select>
              </div>

            </div>

            {/* Registrations Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Registration ID</th>
                      <th className="px-5 py-3.5">Player Details</th>
                      <th className="px-5 py-3.5">Chess.com Handle</th>
                      <th className="px-5 py-3.5">Payment</th>
                      <th className="px-5 py-3.5">Verification</th>
                      <th className="px-5 py-3.5">Club Status</th>
                      <th className="px-5 py-3.5 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {registrations.length > 0 ? (
                      registrations.map((r) => (
                        <tr key={r._id} className="hover:bg-slate-800/20 transition-colors">
                          
                          {/* ID & Date */}
                          <td className="px-5 py-3.5 font-mono">
                            <span className="font-bold text-amber-400">{r.registrationId || 'N/A (Pending)'}</span>
                            <span className="block text-[10px] text-slate-500 mt-0.5">
                              {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          {/* Player Contact */}
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-white block">{r.fullName}</span>
                            <span className="text-[11px] text-slate-400 block">{r.email}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{r.phone}</span>
                          </td>

                          {/* Chess Username */}
                          <td className="px-5 py-3.5">
                            <a
                              href={`https://www.chess.com/member/${r.chessUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono font-bold text-amber-300 hover:underline flex items-center gap-1"
                            >
                              <span>{r.chessUsernameDisplay || r.chessUsername}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          </td>

                          {/* Payment */}
                          <td className="px-5 py-3.5">
                            <StatusBadge type="payment" status={r.paymentStatus} />
                            {r.razorpayPaymentId && (
                              <span className="block text-[9px] font-mono text-slate-500 mt-0.5">
                                {r.razorpayPaymentId}
                              </span>
                            )}
                          </td>

                          {/* Verification */}
                          <td className="px-5 py-3.5">
                            <StatusBadge type="verification" status={r.verificationStatus} />
                            {r.verifiedAt && (
                              <span className="block text-[9px] text-slate-500 mt-0.5">
                                Verified: {new Date(r.verifiedAt).toLocaleDateString()}
                              </span>
                            )}
                          </td>

                          {/* Club Status */}
                          <td className="px-5 py-3.5">
                            <StatusBadge type="club" status={r.clubStatus} />
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                            
                            {/* Verify Button (if Paid and not yet verified) */}
                            {r.paymentStatus === 'PAID' && r.verificationStatus !== 'VERIFIED' && (
                              <button
                                onClick={() => handleQuickVerify(r.registrationId, r.chessUsername)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-bold"
                                title="Verify Player"
                              >
                                Verify
                              </button>
                            )}

                            {/* Approve Club Button (if Verified and Club not approved) */}
                            {r.verificationStatus === 'VERIFIED' && r.clubStatus !== 'APPROVED' && (
                              <button
                                onClick={() => handleApproveClub(r._id)}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 text-[11px] font-bold"
                                title="Approve Chess.com Club Membership"
                              >
                                Approve Club
                              </button>
                            )}

                            {/* Action Modal Trigger (Reject/Refund) */}
                            <button
                              onClick={() => setActionModal({ open: true, regId: r._id, action: 'REJECT', reason: '' })}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 hover:text-red-400 border border-slate-800 text-[11px] font-medium"
                            >
                              Manage
                            </button>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-500">
                          No registrations found matching the selected filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Page {page} of {totalPages}</span>
                  <div className="flex gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-3 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: MANUAL WHATSAPP VERIFICATION FAST PANEL */}
        {activeTab === 'manual-verify' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="glass-panel-gold p-8 rounded-3xl border border-amber-500/30 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 fill-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-white">
                    Manual WhatsApp Verification Flow
                  </h3>
                  <p className="text-xs text-slate-300">
                    Cross-reference WhatsApp message received from player against database records.
                  </p>
                </div>
              </div>

              {verifyResultMsg.text && (
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                    verifyResultMsg.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  {verifyResultMsg.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  <span>{verifyResultMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleManualVerify} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Received Registration ID (e.g. CA-8F42K7) *
                  </label>
                  <input
                    type="text"
                    required
                    value={verifyRegId}
                    onChange={(e) => setVerifyRegId(e.target.value)}
                    placeholder="CA-XXXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-base font-mono font-bold text-amber-400 uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Received Chess.com Username (Optional Cross-Check)
                  </label>
                  <input
                    type="text"
                    value={verifyChessUsername}
                    onChange={(e) => setVerifyChessUsername(e.target.value)}
                    placeholder="e.g. chessmaster123"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    If provided, system will ensure the username matches the original database registration.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Arbiter Action Notes
                  </label>
                  <input
                    type="text"
                    value={verifyNotes}
                    onChange={(e) => setVerifyNotes(e.target.value)}
                    placeholder="e.g. Verified via WhatsApp message on +919876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={manualVerifyLoading}
                  className="w-full py-4 px-6 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {manualVerifyLoading ? (
                    <span>Verifying Database Record...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Verify Player & Unlock Club Instructions</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 3: TOURNAMENT MANAGEMENT */}
        {activeTab === 'tournaments' && tournamentForm && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    Edit Active Tournament Configuration
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure dates, entry fees, prize pools, private club links, and WhatsApp number.
                  </p>
                </div>
                {tournamentSavedMsg && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                    {tournamentSavedMsg}
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveTournament} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Tournament Title *</label>
                    <input
                      type="text"
                      required
                      value={tournamentForm.title}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Status *</label>
                    <select
                      value={tournamentForm.status}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="REGISTRATION_OPEN">REGISTRATION_OPEN</option>
                      <option value="REGISTRATION_CLOSED">REGISTRATION_CLOSED</option>
                      <option value="ONGOING">ONGOING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Date String *</label>
                    <input
                      type="text"
                      required
                      value={tournamentForm.date}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Start Time *</label>
                    <input
                      type="text"
                      required
                      value={tournamentForm.startTime}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, startTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Registration Deadline *</label>
                    <input
                      type="text"
                      required
                      value={tournamentForm.registrationDeadline}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, registrationDeadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Entry Fee (₹) *</label>
                    <input
                      type="number"
                      required
                      value={tournamentForm.entryFee}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, entryFee: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Total Prize Pool (₹) *</label>
                    <input
                      type="number"
                      required
                      value={tournamentForm.prizePool}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, prizePool: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Max Capacity (Players) *</label>
                    <input
                      type="number"
                      required
                      value={tournamentForm.maxParticipants}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, maxParticipants: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Private Chess.com Club URL *</label>
                    <input
                      type="url"
                      required
                      value={tournamentForm.chessClubLink}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, chessClubLink: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Protected: Only revealed to verified paid players.</span>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">WhatsApp Support Number *</label>
                    <input
                      type="text"
                      required
                      value={tournamentForm.whatsappSupportNumber}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, whatsappSupportNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Chess.com Club Joining Instructions *</label>
                  <textarea
                    rows={3}
                    value={tournamentForm.chessClubInstructions}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, chessClubInstructions: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Tournament Configuration</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 4: PUBLISH RESULTS */}
        {activeTab === 'results' && selectedTournament && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    Publish Official Tournament Results
                  </h3>
                  <p className="text-xs text-slate-400">
                    Record winners, runner-ups, and Chess.com cross-table standings.
                  </p>
                </div>
                {resultsSavedMsg && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                    {resultsSavedMsg}
                  </span>
                )}
              </div>

              <form onSubmit={handlePublishResults} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">1st Place (Champion Chess.com Handle) *</label>
                  <input
                    type="text"
                    required
                    value={resultsForm.winner}
                    onChange={(e) => setResultsForm({ ...resultsForm, winner: e.target.value })}
                    placeholder="e.g. MagnusCarlsen"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">2nd Place (Runner-Up Chess.com Handle)</label>
                  <input
                    type="text"
                    value={resultsForm.runnerUp}
                    onChange={(e) => setResultsForm({ ...resultsForm, runnerUp: e.target.value })}
                    placeholder="e.g. Hikaru"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">3rd Place Chess.com Handle</label>
                  <input
                    type="text"
                    value={resultsForm.thirdPlace}
                    onChange={(e) => setResultsForm({ ...resultsForm, thirdPlace: e.target.value })}
                    placeholder="e.g. Dgukesh"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Official Chess.com Standings URL</label>
                  <input
                    type="url"
                    value={resultsForm.standingsUrl}
                    onChange={(e) => setResultsForm({ ...resultsForm, standingsUrl: e.target.value })}
                    placeholder="https://www.chess.com/tournament/live/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tournament Summary / Arbiter Notes</label>
                  <textarea
                    rows={3}
                    value={resultsForm.summary}
                    onChange={(e) => setResultsForm({ ...resultsForm, summary: e.target.value })}
                    placeholder="7 thrilling rounds completed with 0 fair play anomalies..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={resultsForm.setStatusCompleted}
                      onChange={(e) => setResultsForm({ ...resultsForm, setStatusCompleted: e.target.checked })}
                      className="rounded bg-slate-900 border-slate-700 text-amber-500 w-4 h-4"
                    />
                    <span>Mark tournament status as COMPLETED</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 flex items-center gap-2 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Publish Results to Hall of Fame</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-950/60 border-b border-slate-800">
              <h3 className="font-display font-bold text-sm text-white">
                Admin Activity & Verification Audit Trail
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Timestamp</th>
                    <th className="px-5 py-3">Admin</th>
                    <th className="px-5 py-3">Action</th>
                    <th className="px-5 py-3">Target Registration</th>
                    <th className="px-5 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-800/20">
                      <td className="px-5 py-3 text-slate-400 font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 font-semibold text-white">
                        {log.adminName}
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-mono font-bold text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono font-bold text-white">
                        {log.targetRegistrationId || 'N/A'}
                      </td>
                      <td className="px-5 py-3 text-slate-400 text-[11px]">
                        {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Action Reject/Refund Modal */}
      {actionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] rounded-2xl border border-slate-700 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-white">
              Registration Action (Reject or Refund)
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Action</label>
                <select
                  value={actionModal.action}
                  onChange={(e) => setActionModal({ ...actionModal, action: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="REJECT">Reject Registration (Fair Play / Discrepancy)</option>
                  <option value="REFUND">Refund Payment & Cancel Registration</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Reason / Notes for Player</label>
                <textarea
                  rows={3}
                  value={actionModal.reason}
                  onChange={(e) => setActionModal({ ...actionModal, reason: e.target.value })}
                  placeholder="Explain reason for rejection or refund..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActionModal({ open: false, regId: null, action: 'REJECT', reason: '' })}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg"
              >
                Confirm {actionModal.action}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
