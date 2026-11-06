import React from 'react';
import { Batch } from '../types';
import { ArrowRight, Heart, Sparkles, Users, Video, FileText, Folder } from 'lucide-react';

interface BatchCardProps {
  batch: Batch;
  isEnrolled: boolean;
  onToggleEnroll: (e: React.MouseEvent, id: number) => void;
  onStudy: (id: number) => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({
  batch,
  isEnrolled,
  onToggleEnroll,
  onStudy,
}) => {
  return (
    <div className="blue-card rounded-[22px] sm:rounded-3xl overflow-hidden flex flex-col group relative border border-blue-500/20 hover:border-blue-500/50 shadow-xl bg-[#0c1527] w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(37,99,235,0.25)]">
      {/* Thumbnail Area - Full available width, natural aspect ratio, no stretching */}
      <div
        className="relative w-full aspect-[16/9] overflow-hidden bg-black cursor-pointer rounded-t-[20px] sm:rounded-t-[26px]"
        onClick={() => onStudy(batch.id)}
      >
        <img
          src={batch.thumbnail}
          alt={batch.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1527] via-transparent to-black/35 pointer-events-none" />

        {/* Floating Tag Top-Left (e.g. ✦ 11TH / ✦ JEE AITS) */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10">
          <span className="bg-[#0e1d38]/90 border border-blue-500/40 text-blue-300 font-black text-[11px] sm:text-xs tracking-wider px-2.5 sm:px-3 py-1 rounded-xl shadow-md backdrop-blur-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>{batch.badge || batch.target || '11TH'}</span>
          </span>
        </div>

        {/* Floating Heart / Save Button Top-Right (Touch Target min 44x44px on mobile) */}
        <button
          onClick={(e) => onToggleEnroll(e, batch.id)}
          className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-10 w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
            isEnrolled
              ? 'bg-blue-500/30 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]'
              : 'bg-black/60 border-white/15 text-white/80 hover:text-blue-300 hover:border-blue-500/40 active:scale-95'
          }`}
          aria-label={isEnrolled ? 'Saved to My Batches' : 'Save Batch'}
          title={isEnrolled ? 'Enrolled / Saved' : 'Enroll in Batch'}
        >
          <Heart
            className={`w-5 h-5 sm:w-4.5 sm:h-4.5 transition-transform active:scale-125 ${
              isEnrolled ? 'fill-blue-500 text-blue-500' : 'text-white/80'
            }`}
          />
        </button>

        {/* Floating Enrolled Count Bottom-Left */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 z-10">
          <span className="bg-black/80 border border-blue-500/30 text-blue-200 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-xl backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>{batch.students || '45.2k'} students enrolled</span>
          </span>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        {/* Title - Bold, readable font size, no clipping */}
        <h3
          onClick={() => onStudy(batch.id)}
          className="text-white font-black text-base sm:text-lg leading-snug group-hover:text-blue-300 transition-colors line-clamp-2 cursor-pointer"
        >
          {batch.title}
        </h3>

        {/* 3-Column Stats Container (VIDEOS | NOTES | FOLDERS) */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#0f1d38] border border-blue-500/20 text-center my-1">
          {/* Videos */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
              {batch.videoCount || '500+'}
            </span>
            <span className="text-[10px] sm:text-xs text-blue-300/80 font-bold tracking-wider flex items-center gap-1 uppercase mt-0.5">
              <Video className="w-3 h-3 text-blue-400 shrink-0" /> VIDEOS
            </span>
          </div>

          {/* Notes */}
          <div className="flex flex-col items-center justify-center border-x border-blue-500/20 px-1">
            <span className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
              {batch.notesCount || '600+'}
            </span>
            <span className="text-[10px] sm:text-xs text-blue-300/80 font-bold tracking-wider flex items-center gap-1 uppercase mt-0.5">
              <FileText className="w-3 h-3 text-blue-400 shrink-0" /> NOTES
            </span>
          </div>

          {/* Folders */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
              {batch.foldersCount || '150+'}
            </span>
            <span className="text-[10px] sm:text-xs text-blue-300/80 font-bold tracking-wider flex items-center gap-1 uppercase mt-0.5">
              <Folder className="w-3 h-3 text-blue-400 shrink-0" /> FOLDERS
            </span>
          </div>
        </div>

        {/* Full-Width Let's Study Button (Prominent Blue Gradient, 46px min height for easy tapping) */}
        <button
          onClick={() => onStudy(batch.id)}
          className="w-full mt-1 py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base text-white min-h-[46px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(37,99,235,0.45)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <span>Let's Study</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
};
