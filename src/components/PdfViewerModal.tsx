import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  BookOpen,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { resolveMediaContent } from '../services/api';
import { ResolvedMedia } from '../types';

interface PdfViewerModalProps {
  courseId: number | string;
  contentId: string | number;
  pdfTitle: string;
  initialUrl?: string;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  courseId,
  contentId,
  pdfTitle,
  initialUrl,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolved, setResolved] = useState<ResolvedMedia | null>(null);
  const [activeTab, setActiveTab] = useState<'pdf' | 'notes'>('pdf');
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // If initialUrl is a real cloudfront/http link, we can start with it, but still resolve
    if (initialUrl && initialUrl.startsWith('http') && !initialUrl.includes('compressed.tracemonkey')) {
      setResolved({
        courseId: String(courseId),
        contentId: String(contentId),
        decryptedData: {
          id: Number(contentId) || 1,
          title: pdfTitle,
          file_url: initialUrl,
          file_type: 1,
          download_urls: [{ title: 'PDF', url: initialUrl }]
        }
      });
      setLoading(false);
    }

    resolveMediaContent(courseId, contentId)
      .then((data) => {
        if (!isMounted) return;
        if (data && data.decryptedData && data.decryptedData.file_url) {
          setResolved(data);
        } else if (!initialUrl) {
          setError('PDF document URL is currently unavailable.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (!resolved) {
          setError(err.message || 'Failed to resolve PDF document');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [courseId, contentId, initialUrl, pdfTitle]);

  const fileUrl = resolved?.decryptedData.file_url || (initialUrl && initialUrl.startsWith('http') ? initialUrl : '');
  const title = resolved?.decryptedData.title || pdfTitle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl h-[92vh] bg-[#0b1326] border border-blue-500/30 rounded-2xl overflow-hidden shadow-[0_20px_70px_rgba(37,99,235,0.35)] flex flex-col">
        {/* Header Bar */}
        <div className="p-3 sm:p-4 bg-black/75 border-b border-blue-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden max-w-[55%] sm:max-w-[65%]">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-xs sm:text-sm text-white truncate">{title}</h3>
              <p className="text-[10px] text-blue-300/80 font-semibold truncate">
                GB STUDY • Kota Verified Real PDF Notes
              </p>
            </div>
          </div>

          {/* Mode Switcher & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-black/50 border border-blue-500/30 rounded-xl p-0.5 text-xs font-bold">
              <button
                onClick={() => setActiveTab('pdf')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'pdf'
                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>PDF Document</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Key Formulas &amp; Summary</span>
              </button>
            </div>

            {fileUrl && (
              <>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="btn-blue-primary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  title="Open real PDF in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open Real PDF</span>
                </a>
                <a
                  href={fileUrl}
                  download
                  className="p-2 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-xl transition-colors cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </a>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Close PDF Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex sm:hidden border-b border-blue-500/20 bg-black/40 p-1">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-1.5 text-xs font-bold text-center rounded-lg transition-colors cursor-pointer ${
              activeTab === 'pdf' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40' : 'text-gray-400'
            }`}
          >
            PDF Document
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-1.5 text-xs font-bold text-center rounded-lg transition-colors cursor-pointer ${
              activeTab === 'notes' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40' : 'text-gray-400'
            }`}
          >
            Formulas &amp; Notes
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-black/40 relative flex flex-col items-center justify-center overflow-hidden">
          {activeTab === 'pdf' ? (
            <div className="w-full h-full relative flex flex-col items-center justify-between">
              {/* Prominent High-Visibility Action Bar for Real CloudFront PDF */}
              {fileUrl && (
                <div className="w-full bg-[#0d1830] border-b border-blue-500/25 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-blue-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold truncate">Real Kota Classroom PDF Notes Ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUseGoogleViewer(!useGoogleViewer)}
                      className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-white/10 text-gray-300 text-[11px] font-bold border border-white/10 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 text-blue-400" />
                      <span>{useGoogleViewer ? 'Switch to Native View' : 'Switch to Web Viewer'}</span>
                    </button>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Full Screen PDF</span>
                    </a>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-blue-400">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                  <p className="text-sm font-semibold tracking-wide">Fetching Real Kota Classroom Notes PDF...</p>
                </div>
              )}

              {!loading && error && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md">
                  <FileText className="w-12 h-12 text-blue-400 mb-3 mx-auto" />
                  <h4 className="text-white font-bold mb-1">PDF Notice</h4>
                  <p className="text-xs text-gray-300 mb-4">{error}</p>
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-blue-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Document Directly</span>
                    </a>
                  )}
                </div>
              )}

              {!loading && !error && fileUrl && (
                <div className="flex-1 w-full h-full relative overflow-hidden bg-white">
                  {useGoogleViewer ? (
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                      title={title}
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <object
                      data={fileUrl}
                      type="application/pdf"
                      className="w-full h-full border-0"
                    >
                      <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                        title={title}
                        className="w-full h-full border-0"
                      />
                    </object>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Built-in Study Notes & Formulas reader */
            <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-gray-200">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-extrabold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>CHAPTER QUICK REVISION &amp; FORMULA SHEET</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">{title}</h2>
                <p className="text-xs text-gray-300">
                  Curated Kota classroom notes, essential formula derivations, and board/JEE/NEET high-yield pointers.
                </p>
              </div>

              {/* Key Concept Highlights */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-blue-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Key Points &amp; Fundamental Principles</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">1. Conceptual Clarity</span>
                    <p className="text-gray-400">
                      Master basic definitions and standard sign conventions before solving complex multi-step problems.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">2. Units &amp; Dimensional Consistency</span>
                    <p className="text-gray-400">
                      Always double-check SI unit conversions (cm to m, minutes to seconds, grams to kg) in numerical calculations.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">3. Graphical Interpretation</span>
                    <p className="text-gray-400">
                      Slope and area under curves represent instantaneous rates and accumulated quantities (e.g., F-x curve area gives work done).
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">4. High-Yield PYQs</span>
                    <p className="text-gray-400">
                      Previous 10 years question dissection shows over 70% of exam questions follow identical fundamental derivations.
                    </p>
                  </div>
                </div>
              </div>

              {/* DPP Practice Guidance */}
              <div className="p-4 rounded-xl bg-black/60 border border-blue-500/20 space-y-3">
                <h3 className="text-sm font-black text-blue-300 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span>How to Solve This Chapter's DPP Sheet</span>
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-300">
                  <li>Complete the video lectures before attempting Level-2 questions.</li>
                  <li>Set a timer for 45 minutes for each 15-question problem set.</li>
                  <li>Maintain a separate error notebook for tricky and calculation-heavy questions.</li>
                  <li>Revisit the Formula Handbook PDF before mock tests.</li>
                </ol>
              </div>

              {/* Direct Download Banner */}
              {fileUrl && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-sm font-black text-white">Full Resolution Kota PDF File</h4>
                    <p className="text-xs text-blue-300/80">
                      Download the complete verified handwritten classroom PDF for offline reading and printing.
                    </p>
                  </div>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="btn-blue-primary px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shrink-0 cursor-pointer shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Original PDF File</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
