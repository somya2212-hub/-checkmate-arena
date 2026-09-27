import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp = ({ whatsappNumber = '+919876543210' }) => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const message = 'Hello Checkmate Arena, I have a question regarding the upcoming chess tournament.';
  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs shadow-xl shadow-emerald-950/40 hover:scale-105 transition-all duration-200 group border border-emerald-300/30"
      aria-label="Contact Tournament Support on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-slate-950 text-slate-950 group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline font-sans">WhatsApp Support</span>
    </a>
  );
};
