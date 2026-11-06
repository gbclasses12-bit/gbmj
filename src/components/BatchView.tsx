import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Folder,
  Play,
  FileText,
  Clock,
  Calendar,
  CheckCircle,
  Layers,
  ChevronRight,
  Sparkles,
  Loader2,
  Radio,
  Video,
  Send,
  AlertCircle,
  Download,
  Users,
  Link2,
  Plus,
  X
} from 'lucide-react';
import { Batch, BreadcrumbItem, ContentItem, CourseOverview, LiveClassItem } from '../types';
import {
  getCourseOverview,
  getFolderContent,
  getLiveClasses,
  extractItemVideoUrl,
  extractItemPdfUrl,
  TELEGRAM_URL
} from '../services/api';

interface BatchViewProps {
  batch: Batch;
  onBack: () => void;
  onOpenVideo: (contentId: string | number, title: string, isLive?: boolean, fileUrl?: string) => void;
  onOpenPdf: (contentId: string | number, title: string, fileUrl?: string) => void;
}

// Live Countdown Timer Component
const LiveCountdownTimer: React.FC<{ targetTime: number; onZero?: () => void }> = ({ targetTime, onZero }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isZero: boolean }>(() => {
    let target = Number(targetTime);
    if (target > 10_000_000_000) target = Math.floor(target / 1000);
    const now = Math.floor(Date.now() / 1000);
    const diff = Math.max(0, target - now);
    return {
      hours: Math.floor(diff / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: diff % 60,
      isZero: diff === 0,
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      let target = Number(targetTime);
      if (target > 10_000_000_000) target = Math.floor(target / 1000);
      const now = Math.floor(Date.now() / 1000);
      const diff = Math.max(0, target - now);

      if (diff === 0 && !timeLeft.isZero) {
        onZero?.();
      }

      setTimeLeft({
        hours: Math.floor(diff / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
        isZero: diff === 0,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime, timeLeft.isZero, onZero]);

  if (timeLeft.isZero) {
    return (
      <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 font-extrabold text-xs animate-pulse">
        <span className="w-2 h-2 rounded-full bg-blue-600" />
        <span>CLASS STARTING NOW</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 border border-blue-500/30 text-white font-mono">
      <div className="flex flex-col items-center">
        <span className="text-sm font-black text-blue-400 leading-none">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[8px] text-blue-400/60 uppercase font-sans mt-0.5">HRS</span>
      </div>
      <span className="text-blue-400/60 font-bold text-xs pb-2">:</span>
      <div className="flex flex-col items-center">
        <span className="text-sm font-black text-blue-400 leading-none">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[8px] text-blue-400/60 uppercase font-sans mt-0.5">MIN</span>
      </div>
      <span className="text-blue-400/60 font-bold text-xs pb-2">:</span>
      <div className="flex flex-col items-center">
        <span className="text-sm font-black text-blue-400 leading-none">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[8px] text-blue-400/60 uppercase font-sans mt-0.5">SEC</span>
      </div>
    </div>
  );
};

export const BatchView: React.FC<BatchViewProps> = ({
  batch,
  onBack,
  onOpenVideo,
  onOpenPdf,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'overview' | 'live'>('content');
  const [overview, setOverview] = useState<CourseOverview | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);

  // Folder navigation state
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: '0', title: 'Course Content' },
  ]);
  const [currentFolderItems, setCurrentFolderItems] = useState<ContentItem[]>([]);
  const [loadingFolder, setLoadingFolder] = useState(false);

  // Live Classes state
  const [liveSubTab, setLiveSubTab] = useState<'LIVE' | 'UPCOMING' | 'COMPLETED'>('LIVE');
  const [liveItems, setLiveItems] = useState<LiveClassItem[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);
  // Custom Live Stream Link state (Allows Sir / user to broadcast any real live lecture link)
  const [isCustomLiveModalOpen, setIsCustomLiveModalOpen] = useState(false);
  const [customLiveUrl, setCustomLiveUrl] = useState('');
  const [customLiveTitle, setCustomLiveTitle] = useState('');
  const [customLiveInstructor, setCustomLiveInstructor] = useState('Shobhit Bhaiya (GB STUDY Kota)');
  const [customLiveSubject, setCustomLiveSubject] = useState(batch.subjects?.[0] || 'Core Subject');
  const [hasCustomLive, setHasCustomLive] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(`gbstudy_custom_live_${batch.id}`) || localStorage.getItem('gbstudy_custom_live_global');
        if (saved) {
          const p = JSON.parse(saved);
          setCustomLiveUrl(p.url || '');
          setCustomLiveTitle(p.title || '');
          setCustomLiveInstructor(p.instructor || 'Shobhit Bhaiya (GB STUDY Kota)');
          setCustomLiveSubject(p.subject || batch.subjects?.[0] || 'Core Subject');
          setHasCustomLive(true);
        } else {
          setHasCustomLive(false);
        }
      }
    } catch {
      setHasCustomLive(false);
    }
  }, [batch.id]);

  const refreshLiveClasses = () => {
    setLoadingLive(true);
    getLiveClasses(batch.id, liveSubTab)
      .then((items) => {
        setLiveItems(items);
      })
      .finally(() => {
        setLoadingLive(false);
      });
  };

  const handleSaveCustomLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLiveUrl.trim()) return;
    const payload = {
      url: customLiveUrl.trim(),
      title: customLiveTitle.trim() || `${batch.title} - Live Class by Sir`,
      instructor: customLiveInstructor.trim() || 'Sir (GB Study Kota)',
      subject: customLiveSubject.trim() || batch.subjects?.[0] || 'Core Subject',
      thumbnail: batch.thumbnail,
      timestamp: Date.now(),
    };
    localStorage.setItem(`gbstudy_custom_live_${batch.id}`, JSON.stringify(payload));
    setHasCustomLive(true);
    setIsCustomLiveModalOpen(false);
    setLiveSubTab('LIVE');
    refreshLiveClasses();
  };

  const handleRemoveCustomLive = () => {
    localStorage.removeItem(`gbstudy_custom_live_${batch.id}`);
    setHasCustomLive(false);
    setCustomLiveUrl('');
    setCustomLiveTitle('');
    setIsCustomLiveModalOpen(false);
    refreshLiveClasses();
  };

  const currentFolder = breadcrumbs[breadcrumbs.length - 1];

  // Fetch overview on mount
  useEffect(() => {
    let isMounted = true;
    setLoadingOverview(true);
    getCourseOverview(batch.id)
      .then((data) => {
        if (isMounted) setOverview(data);
      })
      .finally(() => {
        if (isMounted) setLoadingOverview(false);
      });
    return () => {
      isMounted = false;
    };
  }, [batch.id]);

  // Fetch folder contents whenever current folder changes
  useEffect(() => {
    let isMounted = true;
    setLoadingFolder(true);
    getFolderContent(batch.id, currentFolder.id)
      .then((items) => {
        if (isMounted) setCurrentFolderItems(items);
      })
      .finally(() => {
        if (isMounted) setLoadingFolder(false);
      });
    return () => {
      isMounted = false;
    };
  }, [batch.id, currentFolder.id]);

  // Fetch live classes whenever live tab is open
  useEffect(() => {
    if (activeTab !== 'live') return;
    let isMounted = true;
    setLoadingLive(true);
    getLiveClasses(batch.id, liveSubTab)
      .then((items) => {
        if (isMounted) setLiveItems(items);
      })
      .finally(() => {
        if (isMounted) setLoadingLive(false);
      });
    return () => {
      isMounted = false;
    };
  }, [batch.id, activeTab, liveSubTab]);

  const navigateToFolder = (folderId: string, folderTitle: string) => {
    setBreadcrumbs((prev) => [...prev, { id: folderId, title: folderTitle }]);
  };

  const navigateToBreadcrumb = (index: number) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  };

  const handleBackOneLevel = () => {
    if (breadcrumbs.length > 1) {
      setBreadcrumbs((prev) => prev.slice(0, prev.length - 1));
    } else {
      onBack();
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds || isNaN(seconds)) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
  };

  const formatDate = (unix?: number) => {
    if (!unix) return '';
    let ts = Number(unix);
    if (ts < 10_000_000_000) ts *= 1000;
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (timestamp?: string | number) => {
    if (!timestamp) return { dateStr: '', timeStr: '' };
    let ts = Number(timestamp);
    if (ts < 10_000_000_000) ts *= 1000;
    const d = new Date(ts);
    if (isNaN(d.getTime())) return { dateStr: '', timeStr: '' };
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    let h = d.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const m = String(d.getMinutes()).padStart(2, '0');
    return { dateStr, timeStr: `${h}:${m} ${ampm}` };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
      {/* Top Banner & Header */}
      <div className="relative rounded-[22px] sm:rounded-3xl overflow-hidden blue-card border border-blue-500/25 p-4 sm:p-7 lg:p-8">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2.5 sm:space-y-3 flex-1">
            <button
              onClick={handleBackOneLevel}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-white bg-blue-500/40 hover:bg-blue-500/50 border border-blue-500/30 px-3.5 py-2 rounded-xl transition-all cursor-pointer min-h-[40px] active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>{breadcrumbs.length > 1 ? 'Go Back' : 'All Batches'}</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-black uppercase bg-blue-600 text-white tracking-wider">
                {batch.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-500/60 text-blue-400 border border-blue-500/30">
                {batch.target}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
                100% FREE ACCESS
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {batch.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Complete batch curriculum designed by India's top Kota educators. Includes daily live lectures, topic-wise video classes, DPP practice questions, revision notes, and live doubt sessions.
            </p>
          </div>

          <div className="w-full md:w-64 aspect-[16/9] rounded-2xl overflow-hidden border border-blue-500/30 shrink-0 shadow-lg bg-black">
            <img
              src={batch.thumbnail}
              alt={batch.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Content, Overview, and Live Classes side by side) */}
      <div className="flex items-center border-b border-blue-500/20 gap-3 sm:gap-6 overflow-x-auto scrollbar-none pb-0 w-full">
        {/* Tab 1: Course Content */}
        <button
          onClick={() => setActiveTab('content')}
          className={`min-h-[44px] pb-3 text-xs sm:text-sm md:text-base font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'content'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white border-b-2 border-transparent'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>Course Content &amp; Lectures</span>
        </button>

        {/* Tab 2: Overview & Syllabus */}
        <button
          onClick={() => setActiveTab('overview')}
          className={`min-h-[44px] pb-3 text-xs sm:text-sm md:text-base font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'overview'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white border-b-2 border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>Overview &amp; Syllabus Details</span>
        </button>

        {/* Tab 3: Live Classes (Added side-by-side as requested) */}
        <button
          onClick={() => setActiveTab('live')}
          className={`min-h-[44px] pb-3 text-xs sm:text-sm md:text-base font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'live'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white border-b-2 border-transparent'
          }`}
        >
          <Radio className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
          <span>Live Classes</span>
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
        </button>
      </div>

      {/* ===================== TAB 1: CONTENT ===================== */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Breadcrumb Navigation Bar */}
          <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm bg-[#160c1d] border border-blue-500/20 rounded-xl px-4 py-3 text-gray-300">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.id}>
                  <button
                    onClick={() => navigateToBreadcrumb(idx)}
                    disabled={isLast}
                    className={`font-semibold transition-colors cursor-pointer ${
                      isLast
                        ? 'text-blue-400 font-bold cursor-default'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {crumb.title}
                  </button>
                  {!isLast && <ChevronRight className="w-3.5 h-3.5 text-blue-400/50 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Loader */}
          {loadingFolder && (
            <div className="py-20 flex flex-col items-center justify-center text-blue-400">
              <Loader2 className="w-10 h-10 animate-spin text-blue-400 mb-3" />
              <p className="text-sm font-semibold tracking-wide">Loading Folder Contents...</p>
            </div>
          )}

          {/* Empty State */}
          {!loadingFolder && currentFolderItems.length === 0 && (
            <div className="py-20 text-center blue-card rounded-2xl border border-blue-500/20 p-8">
              <Folder className="w-12 h-12 text-blue-400/50 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No items found in this section</h3>
              <p className="text-sm text-gray-400 mb-4">Content is being updated by faculty members.</p>
              <button
                onClick={handleBackOneLevel}
                className="btn-blue-secondary px-4 py-2 rounded-xl text-xs font-bold"
              >
                Go to Previous Folder
              </button>
            </div>
          )}

          {/* Items Grid */}
          {!loadingFolder && currentFolderItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 w-full">
              {currentFolderItems.map((item, index) => {
                // FOLDER CARD
                if (item.type === 'folder') {
                  const counts = item.data?.content_counts || {};
                  const vCount = (counts.video?.paid || 0) + (counts.video?.free || 0);
                  const pCount = (counts.pdf?.paid || 0) + (counts.pdf?.free || 0);
                  const fCount = counts.folders?.total || 0;
                  const tCount = (counts.test?.paid || 0) + (counts.test?.free || 0);

                  return (
                    <div
                      key={item.entity_id || index}
                      onClick={() => navigateToFolder(item.entity_id, item.title)}
                      className="blue-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col min-h-[175px] h-full border border-blue-500/20 hover:border-blue-500/50 transition-all p-4 relative justify-between"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-[0_0_15px_rgba(37, 99, 235,0.25)] shrink-0">
                        <Folder className="w-6 h-6 fill-current" />
                      </div>

                      <h4 className="text-white font-bold text-sm leading-snug line-clamp-2 mb-3 group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>

                      {/* Content Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-blue-500/15 text-[10px] font-bold text-blue-400">
                        {vCount > 0 && (
                          <span className="bg-blue-500/60 border border-blue-500/30 px-2 py-0.5 rounded">
                            {vCount} VIDEOS
                          </span>
                        )}
                        {pCount > 0 && (
                          <span className="bg-blue-500/60 border border-blue-500/30 px-2 py-0.5 rounded">
                            {pCount} PDFS
                          </span>
                        )}
                        {fCount > 0 && (
                          <span className="bg-blue-500/60 border border-blue-500/30 px-2 py-0.5 rounded">
                            {fCount} TOPICS
                          </span>
                        )}
                        {tCount > 0 && (
                          <span className="bg-blue-500/60 border border-blue-500/30 px-2 py-0.5 rounded">
                            {tCount} TESTS
                          </span>
                        )}
                        {vCount === 0 && pCount === 0 && fCount === 0 && tCount === 0 && (
                          <span className="text-gray-500">OPEN FOLDER</span>
                        )}
                      </div>
                    </div>
                  );
                }

                // FILE: VIDEO LECTURE CARD
                const isVideo = item.type === 'file' && (item.data?.file_type === 2 || (item.data?.video_type || 0) > 0);
                if (isVideo) {
                  const durationStr = formatDuration(item.data?.duration);
                  const dateStr = formatDate(item.data?.created_at);
                  const realVideoUrl = item.data?.file_url && item.data.file_url.startsWith('http') ? item.data.file_url : undefined;

                  return (
                    <div
                      key={item.entity_id || index}
                      onClick={() => onOpenVideo(item.entity_id || item.data?.id, item.title, false, realVideoUrl)}
                      className="blue-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col min-h-[230px] h-full border border-blue-500/20 hover:border-blue-500/50 transition-all justify-between"
                    >
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video w-full bg-black overflow-hidden border-b border-blue-500/15">
                        <img
                          src={item.data?.thumbnail || batch.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                        />
                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-blue-500/90 text-white flex items-center justify-center pl-0.5 shadow-[0_0_20px_rgba(37, 99, 235,0.6)] group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white" />
                          </div>
                        </div>

                        {/* Top tag */}
                        <div className="absolute top-2 left-2">
                          <span className="bg-blue-500/90 border border-blue-500/40 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-current" /> LECTURE
                          </span>
                        </div>

                        {/* Duration pill */}
                        {durationStr && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-400" />
                            <span>{durationStr}</span>
                          </div>
                        )}
                      </div>

                      {/* Video Title & Meta */}
                      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                        <h4 className="text-white font-semibold text-xs leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-blue-500/10">
                          <span>{dateStr || 'Verified Lecture'}</span>
                          <span className="text-blue-400 font-bold group-hover:underline">
                            Watch Now →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // FILE: PDF NOTES / PRACTICE SHEET CARD
                const isPdf = item.type === 'file' && (item.data?.file_type === 1 || !isVideo);
                if (isPdf) {
                  const dateStr = formatDate(item.data?.created_at);
                  const realPdfUrl = item.data?.file_url && item.data.file_url.startsWith('http') ? item.data.file_url : undefined;

                  return (
                    <div
                      key={item.entity_id || index}
                      onClick={() => onOpenPdf(item.entity_id || item.data?.id, item.title, realPdfUrl)}
                      className="blue-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col min-h-[200px] h-full border border-blue-500/20 hover:border-blue-500/50 transition-all justify-between"
                    >
                      <div className="relative h-[115px] w-full bg-gradient-to-br from-blue-900/30 to-black/80 flex items-center justify-center border-b border-blue-500/15">
                        <FileText className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform drop-shadow-[0_0_12px_rgba(37, 99, 235,0.4)]" />
                        <div className="absolute top-2 left-2">
                          <span className="bg-blue-500/20 text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-blue-500/30">
                            PDF NOTES
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                        <h4 className="text-white font-semibold text-xs leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-blue-500/10">
                          <span>{dateStr || 'Free Study PDF'}</span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenPdf(item.entity_id || item.data?.id, item.title, realPdfUrl);
                            }}
                            className="text-blue-400 font-bold flex items-center gap-1 group-hover:underline cursor-pointer"
                          >
                            <Download className="w-3 h-3" /> View / Download
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // TEST / ASSESSMENT CARD
                return (
                  <div
                    key={item.entity_id || index}
                    className="col-span-full blue-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-500/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-wider">
                          MOCK TEST / ASSESSMENT
                        </span>
                        <h4 className="text-base font-bold text-white mt-1">{item.title}</h4>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Starting test: ${item.title}`)}
                      className="btn-blue-primary px-5 py-2.5 rounded-xl text-xs font-bold self-start sm:self-auto cursor-pointer"
                    >
                      Start Test
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 2: OVERVIEW & SYLLABUS ===================== */}
      {activeTab === 'overview' && (
        <div className="blue-card rounded-3xl p-6 sm:p-8 border border-blue-500/20 space-y-6">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Course Highlights &amp; Syllabus Coverage</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-blue-500/15 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Full Class 11th Syllabus</h4>
                <p className="text-xs text-gray-300 mt-1">In-depth topic coverage matching latest NTA and CBSE curriculum patterns.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-blue-500/15 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Kota Level Practice Sheets (DPPs)</h4>
                <p className="text-xs text-gray-300 mt-1">Hundreds of curated problems with step-by-step video solutions and handouts.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-blue-500/15 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Revision Formula Sheets</h4>
                <p className="text-xs text-gray-300 mt-1">Quick summary sheets for last minute revisions before exams.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-blue-500/15 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Daily Live &amp; Mentorship Sessions</h4>
                <p className="text-xs text-gray-300 mt-1">Live classes, problem dissection, and strategy sessions with top mentors.</p>
              </div>
            </div>
          </div>

          {/* Description Content */}
          <div className="pt-4 border-t border-blue-500/20">
            <h3 className="text-base font-bold text-white mb-3">About this Batch</h3>
            {overview?.description ? (
              <div
                className="text-gray-300 text-sm leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: overview.description }}
              />
            ) : (
              <p className="text-sm text-gray-400">
                This batch provides free comprehensive coaching for students preparing for competitive and board examinations.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: LIVE CLASSES ===================== */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          {/* Live Sub-Navigation Header Bar */}
          <div className="blue-card rounded-2xl p-4 sm:p-5 border border-blue-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                <span>GB STUDY LIVE CLASS PORTAL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Attend Daily Live Lectures
              </h2>
              <p className="text-xs text-gray-300 mt-1">
                Attend scheduled daily live classes, participate in interactive doubt solving, or watch past live recordings anytime.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <button
                  onClick={() => setIsCustomLiveModalOpen(true)}
                  className="btn-blue-secondary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-blue-400 border border-blue-500/40 hover:border-blue-500 active:scale-95 transition-all shadow-[0_0_12px_rgba(37, 99, 235,0.25)] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  <span>सर का लाइव क्लास लिंक लगाएं / बदलें (+ Live Link)</span>
                </button>
                {hasCustomLive && (
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    सर का लाइव ब्रॉडकास्ट एक्टिव है
                  </span>
                )}
              </div>
            </div>

            {/* Sub-Tabs: LIVE NOW, UPCOMING, RECORDED */}
            <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-xl border border-blue-500/20 shrink-0">
              <button
                onClick={() => setLiveSubTab('LIVE')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  liveSubTab === 'LIVE'
                    ? 'btn-blue-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <span>LIVE NOW</span>
              </button>

              <button
                onClick={() => setLiveSubTab('UPCOMING')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  liveSubTab === 'UPCOMING'
                    ? 'btn-blue-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>UPCOMING</span>
              </button>

              <button
                onClick={() => setLiveSubTab('COMPLETED')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  liveSubTab === 'COMPLETED'
                    ? 'btn-blue-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>RECORDED</span>
              </button>
            </div>
          </div>

          {/* Live Classes Content Area */}
          {loadingLive && (
            <div className="py-20 flex flex-col items-center justify-center text-blue-400">
              <Loader2 className="w-10 h-10 animate-spin text-blue-400 mb-3" />
              <p className="text-sm font-semibold tracking-wide">Connecting to Live Server...</p>
            </div>
          )}

          {!loadingLive && liveItems.length === 0 && (
            <div className="py-20 text-center blue-card rounded-2xl border border-blue-500/20 p-8 space-y-3">
              <Radio className="w-12 h-12 text-blue-400/40 mx-auto" />
              <h3 className="text-lg font-bold text-white">No {liveSubTab.toLowerCase()} classes right now</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                {liveSubTab === 'LIVE'
                  ? 'There is no live session on air at this moment. Check Upcoming for the day’s schedule or watch past Recorded classes.'
                  : 'Classes schedule will be updated shortly by the faculty.'}
              </p>
              <button
                onClick={() => setLiveSubTab('UPCOMING')}
                className="btn-blue-secondary px-4 py-2 rounded-xl text-xs font-bold"
              >
                View Upcoming Classes
              </button>
            </div>
          )}

          {!loadingLive && liveItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveItems.map((item, index) => {
                const targetTimestamp = item.live_from || item.live_to;
                const { dateStr, timeStr } = formatDateTime(targetTimestamp);
                const isLiveNow = liveSubTab === 'LIVE' || item.live_status === 1;
                const isUpcoming = liveSubTab === 'UPCOMING' || item.live_status === 0;
                const isCompleted = liveSubTab === 'COMPLETED' || item.live_status === 2;

                return (
                  <div
                    key={item.id || item.video_id || index}
                    className="blue-card rounded-2xl overflow-hidden flex flex-col border border-blue-500/20 hover:border-blue-500/50 transition-all shadow-lg group"
                  >
                    {/* Thumbnail Area */}
                    <div className="relative aspect-video w-full bg-black overflow-hidden border-b border-blue-500/15">
                      <img
                        src={item.thumbnail || batch.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#140d1c] via-transparent to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                        {isLiveNow && (
                          <span className="bg-rose-600 text-white font-extrabold text-[10px] tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            LIVE NOW
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="bg-blue-500/90 border border-blue-500/40 text-blue-400 font-extrabold text-[10px] tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-400" />
                            UPCOMING
                          </span>
                        )}
                        {isCompleted && (
                          <span className="bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-extrabold text-[10px] tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            RECORDED
                          </span>
                        )}
                      </div>

                      {/* Course / Batch Tag */}
                      <div className="absolute bottom-2 left-2.5 z-10">
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/80 px-2 py-0.5 rounded border border-blue-500/30 backdrop-blur-sm">
                          {item.subject || batch.category}
                        </span>
                      </div>
                    </div>

                    {/* Class Details */}
                    <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Timing Bar */}
                      <div className="flex items-center justify-between text-[11px] text-gray-300 bg-black/40 px-2.5 py-1.5 rounded-xl border border-blue-500/15">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          <span>{isLiveNow ? `Started: ${timeStr}` : `${dateStr} • ${timeStr}`}</span>
                        </div>
                        {item.instructor && (
                          <span className="text-[10px] text-blue-400 font-semibold">{item.instructor}</span>
                        )}
                      </div>

                      {/* Action Button / Countdown */}
                      <div className="pt-1 space-y-2">
                        {isLiveNow && (
                          <button
                            onClick={() => onOpenVideo(item.video_id, item.title, true, item.file_url)}
                            className="btn-blue-primary w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(37, 99, 235,0.5)] animate-pulse active:scale-95"
                          >
                            <Play className="w-4 h-4 fill-white" />
                            <span>WATCH LIVE NOW</span>
                          </button>
                        )}

                        {isCompleted && (
                          <div className="space-y-2">
                            <button
                              onClick={() => onOpenVideo(item.video_id, item.title, false, item.file_url)}
                              className="btn-blue-primary w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                            >
                              <Play className="w-4 h-4 fill-white" />
                              <span>WATCH RECORDING</span>
                            </button>
                            {item.pdf_url && (
                              <button
                                onClick={() => onOpenPdf(`pdf_${item.id}`, `${item.title} - Notes`, item.pdf_url)}
                                className="btn-blue-secondary w-full min-h-[40px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-blue-400 border border-blue-500/30"
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-400" />
                                <span>CLASS NOTES PDF</span>
                              </button>
                            )}
                          </div>
                        )}

                        {isUpcoming && (
                          <div className="space-y-2">
                            {targetTimestamp ? (
                              <LiveCountdownTimer
                                targetTime={Number(targetTimestamp)}
                                onZero={() => setLiveSubTab('LIVE')}
                              />
                            ) : null}

                            <button
                              onClick={() => window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer')}
                              className="btn-blue-secondary w-full min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Get Class Alert on Telegram</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================== CUSTOM LIVE STREAM LINK MODAL ===================== */}
      {isCustomLiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsCustomLiveModalOpen(false)} />

          <div className="relative z-10 w-full max-w-lg blue-card rounded-3xl p-5 sm:p-7 border border-blue-500/40 shadow-[0_20px_70px_rgba(37, 99, 235,0.35)] space-y-5 bg-[#120a17]">
            <div className="flex items-start justify-between gap-3 border-b border-blue-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_15px_rgba(37, 99, 235,0.3)]">
                  <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    सर का लाइव क्लास लिंक लगाएं (Set Live Stream)
                  </h3>
                  <p className="text-xs text-blue-400/80 font-medium mt-0.5">
                    {batch.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCustomLiveModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-blue-500/15">
              💡 यदि सर अभी <strong className="text-blue-400">YouTube Live</strong>, unlisted लिंक, HLS (.m3u8) या किसी वीडियो लिंक पर लाइव क्लास ले रहे हैं, तो लिंक यहाँ डालें। यह क्लास तुरंत इस बैच में सबसे ऊपर लाइव दिखेगी।
            </p>

            <form onSubmit={handleSaveCustomLive} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-1.5">
                  लाइव क्लास स्ट्रीम लिंक (YouTube / HLS / MP4) *
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="url"
                    required
                    value={customLiveUrl}
                    onChange={(e) => setCustomLiveUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... या .m3u8"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-blue-500/30 text-white placeholder-gray-500 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-1.5">
                  क्लास का शीर्षक / टॉपिक (Title)
                </label>
                <input
                  type="text"
                  value={customLiveTitle}
                  onChange={(e) => setCustomLiveTitle(e.target.value)}
                  placeholder={`उदा: ${batch.subjects?.[0] || 'Physics'} - Complete Chapter Live Revision`}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-blue-500/30 text-white placeholder-gray-500 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-1.5">
                    सर / शिक्षक का नाम (Faculty)
                  </label>
                  <input
                    type="text"
                    value={customLiveInstructor}
                    onChange={(e) => setCustomLiveInstructor(e.target.value)}
                    placeholder="Shobhit Bhaiya / Rajan Sir"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-blue-500/30 text-white placeholder-gray-500 text-xs focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-1.5">
                    विषय (Subject)
                  </label>
                  <input
                    type="text"
                    value={customLiveSubject}
                    onChange={(e) => setCustomLiveSubject(e.target.value)}
                    placeholder="Physics / Chemistry / Maths"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-blue-500/30 text-white placeholder-gray-500 text-xs focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="submit"
                  className="btn-blue-primary w-full py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(37, 99, 235,0.5)] active:scale-95 transition-transform"
                >
                  <Radio className="w-4 h-4 text-white animate-pulse" />
                  <span>लाइव क्लास शुरू करें (Broadcast Live)</span>
                </button>

                {hasCustomLive && (
                  <button
                    type="button"
                    onClick={handleRemoveCustomLive}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-bold bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 text-rose-300 transition-all cursor-pointer whitespace-nowrap"
                  >
                    लिंक हटाएं (Reset)
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
