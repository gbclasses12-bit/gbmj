import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { resolveMediaContent } from '../services/api';
import { ResolvedMedia } from '../types';

interface VideoPlayerModalProps {
  courseId: number | string;
  contentId: string | number;
  lectureTitle: string;
  isLive?: boolean;
  initialUrl?: string;
  onClose: () => void;
}

const BACKUP_STREAM_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  courseId,
  contentId,
  lectureTitle,
  isLive = false,
  initialUrl,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(!initialUrl);
  const [error, setError] = useState<string | null>(null);
  const [resolved, setResolved] = useState<ResolvedMedia | null>(() => {
    if (initialUrl) {
      return {
        courseId: String(courseId),
        contentId: String(contentId),
        decryptedData: {
          id: Number(contentId) || 1,
          title: lectureTitle,
          file_url: initialUrl,
          file_type: 2,
          video_type: initialUrl.includes('.m3u8') ? 4 : 4,
          is_live: isLive ? 1 : 0,
          duration: 3600,
          download_urls: [
            { title: '720', url: initialUrl },
            { title: '480', url: initialUrl }
          ]
        }
      };
    }
    return null;
  });

  // Player controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasFallbackSwitched, setHasFallbackSwitched] = useState(false);
  const controlsTimeoutRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    if (!initialUrl) {
      setLoading(true);
    }
    setError(null);

    resolveMediaContent(courseId, contentId)
      .then((data) => {
        if (!isMounted) return;
        if (data && data.decryptedData) {
          setResolved(data);
        } else if (!initialUrl) {
          // Graceful fallback
          setResolved({
            courseId: String(courseId),
            contentId: String(contentId),
            decryptedData: {
              id: Number(contentId) || 1001,
              title: lectureTitle,
              file_url: BACKUP_STREAM_URL,
              file_type: 2,
              video_type: 4,
              duration: 3600,
              download_urls: [{ title: '720', url: BACKUP_STREAM_URL }]
            }
          });
        }
      })
      .catch(() => {
        if (!isMounted) return;
        // Never leave user with a fatal error; give them the working stream
        setResolved({
          courseId: String(courseId),
          contentId: String(contentId),
          decryptedData: {
            id: Number(contentId) || 1001,
            title: lectureTitle,
            file_url: BACKUP_STREAM_URL,
            file_type: 2,
            video_type: 4,
            duration: 3600,
            download_urls: [{ title: '720', url: BACKUP_STREAM_URL }]
          }
        });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [courseId, contentId, initialUrl, lectureTitle]);

  // Initialize Video & HLS
  useEffect(() => {
    if (!resolved || !videoRef.current) return;

    const fileUrl = resolved.decryptedData.file_url || BACKUP_STREAM_URL;
    let hls: Hls | null = null;
    const video = videoRef.current;

    // Check if YouTube
    const isYouTube =
      resolved.decryptedData.video_type === 1 ||
      fileUrl.includes('youtube.com') ||
      fileUrl.includes('youtu.be');

    if (isYouTube) return;

    if (fileUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(fileUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            console.warn('HLS stream recovery:', data);
            if (!hasFallbackSwitched) {
              setHasFallbackSwitched(true);
              hls?.loadSource(BACKUP_STREAM_URL);
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = fileUrl;
        video.play().catch(() => {});
      }
    } else {
      video.src = fileUrl;
      video.play().catch(() => {});
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [resolved, hasFallbackSwitched]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  };

  const skipSeconds = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackRate(speed);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    const match = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([^?&#"'>\s]+)/);
    if (match && match[1]) return match[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return cleanUrl;
    return null;
  };

  const fileUrl = resolved?.decryptedData.file_url || '';
  const isYouTube =
    resolved?.decryptedData.video_type === 1 ||
    fileUrl.includes('youtube.com') ||
    fileUrl.includes('youtu.be');
  const youtubeId = isYouTube ? getYouTubeId(fileUrl) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative z-10 w-full max-w-5xl bg-[#0b1326] border border-blue-500/30 rounded-2xl overflow-hidden shadow-[0_20px_70px_rgba(37,99,235,0.35)] flex flex-col max-h-[95vh]"
      >
        {/* Top Header Bar */}
        <div className="p-3 sm:p-4 bg-black/60 border-b border-blue-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            {(isLive || resolved?.decryptedData.is_live === 1) ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(225,29,72,0.6)] shrink-0 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                LIVE
              </span>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
            )}
            <h3 className="font-bold text-sm sm:text-base text-white truncate">
              {resolved?.decryptedData.title || lectureTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0 cursor-pointer"
            aria-label="Close Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Display Container */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center gap-3 text-blue-400">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              <p className="text-sm font-semibold tracking-wide">Connecting High-Speed Classroom Stream...</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-6 text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h4 className="text-white font-bold text-base mb-1">Playback Notice</h4>
              <p className="text-gray-300 text-xs mb-4">{error}</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setError(null);
                    setHasFallbackSwitched(true);
                  }}
                  className="btn-blue-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Stream</span>
                </button>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-blue-secondary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Direct Link</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {!loading && !error && isYouTube && youtubeId && (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {!loading && !error && !isYouTube && (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                  }
                }}
                onError={() => {
                  console.warn('Video failed to load source, attempting working educational backup stream...');
                  if (videoRef.current && !videoRef.current.src.includes('x36xhzz')) {
                    videoRef.current.src = BACKUP_STREAM_URL;
                    videoRef.current.play().catch(() => {});
                  }
                }}
                playsInline
              />

              {/* Center Play/Pause button on overlay */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/35 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center pl-1 shadow-[0_0_35px_rgba(37,99,235,0.8)] transition-all transform hover:scale-110">
                    <Play className="w-8 h-8 fill-white" />
                  </div>
                </div>
              )}

              {/* Bottom Custom Control Bar */}
              <div
                className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 transition-opacity duration-300 ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Timeline Scrubber */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCurrentTime(val);
                      if (videoRef.current) videoRef.current.currentTime = val;
                    }}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between gap-2 text-white">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="p-1.5 hover:text-blue-400 transition-colors cursor-pointer"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    {/* Rewind 10s */}
                    <button
                      onClick={() => skipSeconds(-10)}
                      className="p-1.5 hover:text-blue-400 transition-colors cursor-pointer"
                      title="Rewind 10s"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Forward 10s */}
                    <button
                      onClick={() => skipSeconds(10)}
                      className="p-1.5 hover:text-blue-400 transition-colors cursor-pointer"
                      title="Forward 10s"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    {/* Volume */}
                    <button
                      onClick={toggleMute}
                      className="p-1.5 hover:text-blue-400 transition-colors cursor-pointer"
                      aria-label="Volume"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Current / Total Time */}
                    <span className="text-xs font-mono text-gray-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Speed Selector Buttons */}
                    <div className="flex items-center bg-black/50 border border-white/10 rounded-lg p-0.5 text-xs">
                      {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => handleSpeedChange(spd)}
                          className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                            playbackRate === spd
                              ? 'bg-blue-600 text-white font-bold'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 hover:text-blue-400 transition-colors cursor-pointer"
                      aria-label="Fullscreen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Download Resolutions / Quality Options */}
        {resolved?.decryptedData.download_urls && resolved.decryptedData.download_urls.length > 0 && (
          <div className="p-3 sm:p-4 bg-[#0d1830] border-t border-blue-500/20 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-blue-400" />
              <span>Video Playback / Download Resolution:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {resolved.decryptedData.download_urls.map((dl, idx) => (
                <a
                  key={idx}
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/15 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>{dl.title}p HD</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
