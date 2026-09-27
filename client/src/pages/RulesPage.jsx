import React from 'react';
import { Shield, CheckCircle2, AlertTriangle, Scale, Clock, RefreshCw, HelpCircle, FileText, Ban } from 'lucide-react';

export const RulesPage = () => {
  return (
    <div className="min-h-screen py-12 relative chess-pattern-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Official Guidelines & Fair Play
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Tournament Rules & Regulations
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            All participants are required to read, understand, and adhere to these regulations prior to registering.
          </p>
        </div>

        {/* Navigation jump pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <a href="#eligibility" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700">1. Eligibility</a>
          <a href="#username" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700">2. Username Rules</a>
          <a href="#format" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700">3. Format & Clock</a>
          <a href="#fair-play" className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">4. Fair Play Policy</a>
          <a href="#checkin" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700">5. Check-In</a>
          <a href="#refunds" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700">6. Refund Policy</a>
        </div>

        {/* Rules Content */}
        <div className="space-y-8">
          
          {/* 1. Eligibility & Registration */}
          <section id="eligibility" className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">1</span>
              <span>Eligibility & Registration Requirements</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>• The tournament is open to all chess enthusiasts, rated and unrated players.</p>
              <p>• Players must have an active, good-standing account on <strong>Chess.com</strong> created at least 7 days prior to the tournament date.</p>
              <p>• Registration must be completed through the official Checkmate Arena portal with payment confirmed via Razorpay.</p>
              <p>• Duplicate registrations under different names for the same Chess.com account are strictly forbidden.</p>
            </div>
          </section>

          {/* 2. Chess.com Username Consistency */}
          <section id="username" className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">2</span>
              <span>Chess.com Username Strict Consistency</span>
            </h2>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm space-y-2">
              <div className="font-bold flex items-center gap-2 text-amber-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Crucial Account Verification Rule</span>
              </div>
              <p>
                You <strong>MUST</strong> play the tournament using the exact Chess.com username entered during registration.
              </p>
              <p>
                Our arbiter system matches your verified Registration ID to your Chess.com handle. If you attempt to join the private club with an alternate, smurf, or second account, your join request will be rejected immediately without refund.
              </p>
            </div>
          </section>

          {/* 3. Format & Time Control */}
          <section id="format" className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">3</span>
              <span>Format, Rounds & Time Control</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>• <strong>System:</strong> Swiss System (7 Rounds). All players participate across all 7 rounds.</p>
              <p>• <strong>Time Control:</strong> 10 minutes per player + 0 seconds increment (Rapid).</p>
              <p>• <strong>Pairings:</strong> Generated strictly and automatically by Chess.com server algorithms.</p>
              <p>• <strong>Interval:</strong> Rounds begin automatically approximately 2 to 3 minutes after the completion of the preceding round.</p>
            </div>
          </section>

          {/* 4. Strict Fair Play Policy */}
          <section id="fair-play" className="glass-panel p-8 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-slate-900/90 space-y-6">
            <h2 className="font-display font-bold text-2xl text-amber-400 flex items-center gap-2.5">
              <Shield className="w-6 h-6 text-amber-400" />
              <span>4. Fair Play & Anti-Cheating Policy</span>
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Checkmate Arena is committed to maintaining 100% fair competition. We adhere strictly to Chess.com Fair Play rules and work closely with platform moderation.
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-red-500/20 flex items-start gap-3">
                <Ban className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Zero Engine Tolerance:</strong>
                  <span>Any use of chess engines (Stockfish, Komodo, etc.), evaluation bars, tablebases, or opening books during games is strictly prohibited.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-red-500/20 flex items-start gap-3">
                <Ban className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">No External Assistance:</strong>
                  <span>Having another player or coach advise or make moves on your behalf during tournament games will result in immediate disqualification.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-red-500/20 flex items-start gap-3">
                <Ban className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Account Flagging / Closure:</strong>
                  <span>If Chess.com flags or closes an account for fair play violations during or following the event, the player will be automatically disqualified and permanently barred from future Checkmate Arena events. All prizes will be forfeited and redistributed to the next eligible player.</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Note: Checkmate Arena enforces official Chess.com fair play decisions alongside independent arbiter game evaluations and accuracy anomaly tracking.
            </p>
          </section>

          {/* 5. Check-In & Disconnections */}
          <section id="checkin" className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">5</span>
              <span>Check-in, Late Joining & Disconnections</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>• <strong>Mandatory Check-in:</strong> Players must be online and present in the private Chess.com club tournament lobby at least 15 minutes before the start time.</p>
              <p>• <strong>Late Joining:</strong> Players who fail to join the lobby before Round 1 pairing begins cannot be manually injected into Round 1. Half-point byes or zero points will apply according to Chess.com Swiss rules.</p>
              <p>• <strong>Network Stability:</strong> Disconnections during games are the sole responsibility of the player. If a player disconnects, their clock continues to run. No match will be restarted due to individual network issues.</p>
            </div>
          </section>

          {/* 6. Refund & Cancellation Policy */}
          <section id="refunds" className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">6</span>
              <span>Refund & Cancellation Policy</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>• <strong>Full Refund (100%):</strong> Eligible if cancellation is requested at least 24 hours prior to the official registration deadline by contacting our WhatsApp support with your Registration ID.</p>
              <p>• <strong>Non-Refundable Scenarios:</strong></p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
                <li>Cancellation requested less than 24 hours before the registration deadline.</li>
                <li>Player fails to check-in or does not show up for the tournament.</li>
                <li>Disconnection or internet dropouts during matches.</li>
                <li>Disqualification resulting from Fair Play violations or submitting incorrect Chess.com accounts.</li>
              </ul>
              <p>• In the unlikely event of tournament cancellation by the organizers, 100% entry fees will be refunded to all paid participants within 48 hours.</p>
            </div>
          </section>

          {/* 7. Organizer Authority */}
          <section className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">7</span>
              <span>Organizer Decisions & Disputes</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The decision of the Chief Arbiter and Checkmate Arena tournament management committee is final and binding on all matters relating to pairing, dispute resolution, fair play disqualification, and prize allocations.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
