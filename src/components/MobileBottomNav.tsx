import React from 'react';
import { Home, Layers, Search, Send, Heart } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  enrolledCount: number;
  onOpenSearch: () => void;
  onOpenTelegramModal: () => void;
  onGoHome: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  enrolledCount,
  onOpenSearch,
  onOpenTelegramModal,
  onGoHome,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#070b14]/95 backdrop-blur-xl border-t border-blue-500/25 px-1 py-1.5 safe-bottom shadow-[0_-8px_25px_rgba(0,0,0,0.6)]"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center w-full max-w-lg mx-auto">
        {/* Home */}
        <button
          onClick={onGoHome}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            currentTab === 'all'
              ? 'text-blue-400 font-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 shrink-0" />
          <span className="text-[11px] mt-0.5 tracking-tight font-bold">Home</span>
        </button>

        {/* Batches */}
        <button
          onClick={() => onTabChange('all')}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            currentTab === 'JEE' || currentTab === 'NEET' || currentTab === 'AITS'
              ? 'text-blue-400 font-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5 shrink-0" />
          <span className="text-[11px] mt-0.5 tracking-tight font-bold">Batches</span>
        </button>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl text-gray-400 hover:text-blue-300 transition-all cursor-pointer active:scale-95"
        >
          <Search className="w-5 h-5 shrink-0" />
          <span className="text-[11px] mt-0.5 tracking-tight font-bold">Search</span>
        </button>

        {/* Telegram */}
        <button
          onClick={onOpenTelegramModal}
          className="min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl text-gray-400 hover:text-blue-400 transition-all cursor-pointer active:scale-95"
        >
          <Send className="w-5 h-5 shrink-0" />
          <span className="text-[11px] mt-0.5 tracking-tight font-bold">Telegram</span>
        </button>

        {/* Saved (Heart Icon) */}
        <button
          onClick={() => onTabChange('enrolled')}
          className={`min-h-[48px] relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            currentTab === 'enrolled'
              ? 'text-blue-400 font-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 shrink-0 ${currentTab === 'enrolled' ? 'fill-blue-500 text-blue-500' : ''}`} />
            {enrolledCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4.5 h-4.5 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center shadow-md">
                {enrolledCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-bold">Saved</span>
        </button>
      </div>
    </nav>
  );
};
