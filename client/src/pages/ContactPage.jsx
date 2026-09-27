import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, ShieldCheck, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactPage = () => {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationId: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen py-12 relative chess-pattern-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Arbiter & Organizer Support
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Contact Checkmate Arena
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Need assistance with WhatsApp verification, private Chess.com club access, or payment queries? Reach our team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Direct Channels */}
          <div className="space-y-4">
            
            {/* WhatsApp Card */}
            <a
              href="https://wa.me/919876543210?text=Hello%20Checkmate%20Arena%20Support"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel p-6 rounded-2xl border border-emerald-500/30 hover:border-emerald-500 block group transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 fill-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">WhatsApp Desk</h3>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Fastest Response</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct verification channel and real-time arbiter assistance during tournament hours.
              </p>
              <p className="text-xs font-mono font-bold text-slate-200 mt-2">+91 98765 43210</p>
            </a>

            {/* Email Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">Official Email</h3>
                  <span className="text-[10px] text-slate-400">Formal Inquiries</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                support@checkmatearena.com
              </p>
            </div>

            {/* Fair Play & Arbiter Desk */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">Chief Arbiter Desk</h3>
                  <span className="text-[10px] text-slate-400">Dispute Review</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Post-tournament game accuracy inquiries and official dispute resolution.
              </p>
            </div>

          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="font-display font-bold text-xl text-white">
              Send Organizer a Message
            </h3>

            {formSent ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-base">Message Sent Successfully</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out. A tournament arbiter will review your inquiry and respond within 2-4 hours.
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="player@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Registration ID (If Registered)</label>
                    <input
                      type="text"
                      value={formData.registrationId}
                      onChange={(e) => setFormData({ ...formData, registrationId: e.target.value })}
                      placeholder="CA-XXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white font-mono uppercase focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white focus:outline-none"
                    >
                      <option value="WhatsApp Verification Help">WhatsApp Verification Help</option>
                      <option value="Chess.com Club Access Issue">Chess.com Club Access Issue</option>
                      <option value="Payment Inquiry">Payment Inquiry</option>
                      <option value="Fair Play Question">Fair Play Question</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Message Details *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue or query..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 flex items-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry to Arbiter Desk</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
