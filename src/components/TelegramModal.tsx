import React from 'react';
import { Send, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { APP_LOGO, TELEGRAM_URL } from '../services/api';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleJoin = () => {
    window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-[#0c1527] border border-blue-500/30 rounded-2xl p-6 sm:p-7 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.45)] overflow-hidden">
        {/* Glow backdrop decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="relative inline-block mx-auto mb-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.5)] p-0.5 bg-black">
              <img src={APP_LOGO} alt="GB STUDY" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-full text-white shadow-md">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL TELEGRAM COMMUNITY</span>
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight mb-2">
            Join GB STUDY Telegram Channel
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed mb-6">
            Get instant access to free Kota DPPs, revision formula notes, live updates, and new batch announcements!
          </p>

          <div className="space-y-2.5 text-left bg-black/40 border border-blue-500/20 rounded-xl p-3.5 mb-6 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Daily Practice Problem (DPP) Sheets &amp; Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Full Chapter Mind-maps &amp; Formula PDF Handouts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Mentorship &amp; Baatcheet direct notifications</span>
            </div>
          </div>

          {/* Buttons: Join Telegram & Close */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleJoin}
              className="flex-1 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Join Telegram</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl font-semibold text-sm text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 hover:text-white transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
