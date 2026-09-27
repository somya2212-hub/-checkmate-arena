import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Shield, MessageCircle, Mail, ExternalLink, Award } from 'lucide-react';

export const Footer = ({ whatsappNumber = '+919876543210' }) => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#06080c] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Crown className="w-5 h-5 text-slate-950 fill-slate-950" />
              </div>
              <span className="font-display font-black text-xl text-white tracking-tight">
                CHECKMATE <span className="text-amber-500">ARENA</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              India's trusted platform for competitive online chess tournaments. Verified registrations, guaranteed transparent prize pools, and arbiter-supervised private Chess.com club events.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Shield className="w-3.5 h-3.5" />
                Hosted by Checkmate Arena
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Tournament
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/tournament" className="hover:text-amber-400 transition-colors">
                  Upcoming Event Details
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-amber-400 transition-colors">
                  Registration & Entry
                </Link>
              </li>
              <li>
                <Link to="/prizes" className="hover:text-amber-400 transition-colors">
                  Prize Distribution
                </Link>
              </li>
              <li>
                <Link to="/players" className="hover:text-amber-400 transition-colors">
                  Registered Players
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-amber-400 transition-colors">
                  Previous Tournaments & Results
                </Link>
              </li>
            </ul>
          </div>

          {/* Integrity & Rules */}
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Rules & Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/rules" className="hover:text-amber-400 transition-colors">
                  Tournament Rules
                </Link>
              </li>
              <li>
                <Link to="/rules#fair-play" className="hover:text-amber-400 transition-colors">
                  Fair Play Policy
                </Link>
              </li>
              <li>
                <Link to="/rules#refunds" className="hover:text-amber-400 transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-amber-400 transition-colors">
                  Check Registration Status
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Official Contact
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href={`https://wa.me/${cleanNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all font-medium"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp Support</span>
              </a>
              <a
                href="mailto:support@checkmatearena.com"
                className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0 text-amber-400" />
                <span>support@checkmatearena.com</span>
              </a>
              <Link
                to="/admin/login"
                className="inline-block text-[11px] text-slate-500 hover:text-slate-400 pt-2"
              >
                Organizer Admin Access →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Checkmate Arena. All rights reserved.</p>
          <p className="text-[11px] text-slate-600 text-center sm:text-right">
            Chess.com is a registered trademark of Chess.com LLC. Checkmate Arena is an independent tournament organizer.
          </p>
        </div>
      </div>
    </footer>
  );
};
