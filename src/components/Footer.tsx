import React from 'react';
import { Send, Heart, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import { APP_LOGO } from '../services/api';

interface FooterProps {
  onOpenTelegramModal: () => void;
  onFilterTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTelegramModal, onFilterTab }) => {
  return (
    <footer className="mt-20 border-t border-blue-500/20 bg-[#060a12] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.4)] shrink-0 bg-black">
                <img src={APP_LOGO} alt="GB STUDY" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                GB <span className="text-blue-500">STUDY</span>
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              GB STUDY is dedicated to making high quality JEE, NEET, and Test Series preparation 100% free and accessible to all students across India. Direct streaming, zero paywalls, and no account required.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <ShieldCheck className="w-4 h-4" />
              <span>No Login • No Sign Up • Completely Free</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Batches</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onFilterTab('JEE')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Drona JEE Batches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterTab('NEET')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Drona NEET Batches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterTab('AITS')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  All India Test Series (AITS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterTab('enrolled')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  My Enrolled Courses
                </button>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Community</h4>
            <p className="text-xs text-gray-400 mb-3">
              Join 100,000+ students on Telegram for DPPs, formulas, and updates.
            </p>
            <button
              onClick={onOpenTelegramModal}
              className="btn-blue-primary w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Join Telegram</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-blue-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} GB STUDY. All educational content belongs to its respective owners.</p>
          <div className="flex items-center gap-1 text-blue-400/80">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
            <span>for Indian Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
