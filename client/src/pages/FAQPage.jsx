import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, CreditCard, MessageCircle, Trophy } from 'lucide-react';

export const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How do I join the private Chess.com club after registration?',
      a: 'After completing payment, you will receive a unique Registration ID (e.g. CA-8F42K7). Click the "Verify on WhatsApp" button to send your ID and registered Chess.com username to the organizer. Once our arbiter verifies your payment and username, you will be given the private club link to join and will be approved for tournament entry.',
    },
    {
      q: 'Why do I need to verify on WhatsApp?',
      a: 'To protect the tournament from unauthorized players, bots, and smurfs, Checkmate Arena maintains private club security. The organizer cross-checks every single club request against paid registrations before granting entry.',
    },
    {
      q: 'What if someone shares the private Chess.com club link?',
      a: 'Possessing the club link does NOT grant tournament access. The club is strictly private with invite approval required. Organizers only approve players whose Chess.com username matches a verified, paid Registration ID in the database.',
    },
    {
      q: 'Do I ever need to share my Chess.com password?',
      a: 'NEVER. Checkmate Arena will never ask for your Chess.com password or account credentials. You only need to provide your public Chess.com username.',
    },
    {
      q: 'What happens if I enter the wrong Chess.com username during registration?',
      a: 'Contact Checkmate Arena tournament support on WhatsApp immediately with your Registration ID and email proof. We can correct your username before club verification is finalized.',
    },
    {
      q: 'How are prizes paid out?',
      a: 'Cash prizes are distributed via UPI or direct IMPS/NEFT bank transfer within 24 hours of tournament conclusion, after fair-play clearance by Chess.com and arbiter review.',
    },
    {
      q: 'What is the refund policy?',
      a: 'You are eligible for a 100% refund if you cancel your registration at least 24 hours before the registration deadline by messaging our WhatsApp support. No refunds are granted for no-shows or fair-play disqualifications.',
    },
    {
      q: 'What if I disconnect during a match?',
      a: 'Online chess clocks continue running during network interruptions. No match resets are granted for personal connectivity issues. We strongly advise playing on a stable broadband or strong 4G/5G connection.',
    },
  ];

  return (
    <div className="min-h-screen py-12 relative chess-pattern-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Frequently Asked Questions
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Knowledge Base & Player FAQ
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Everything you need to know about registration, verification, Chess.com club security, and prize payouts.
          </p>
        </div>

        {/* Accordion */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-950/60 border border-slate-800/80 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-sm sm:text-base text-white hover:text-amber-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-3">
          <h3 className="font-display font-bold text-lg text-white">
            Still have a question not answered here?
          </h3>
          <p className="text-xs text-slate-400">
            Our arbiter support desk is available on WhatsApp to assist with tournament registration queries.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/919876543210?text=Hello%20Checkmate%20Arena%20Support,%20I%20have%20a%20question"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#25D366] text-slate-950 font-bold text-xs hover:bg-[#20bd5a]"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Chat with Organizer on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
