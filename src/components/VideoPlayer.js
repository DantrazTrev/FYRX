import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
  Loader2
} from 'lucide-react';

const VideoPlayer = ({ 
  url, 
  playing, 
  onPlay, 
  onPause, 
  onProgress, 
  onEnded,
  showControls = true,
  className = '' 
}) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [showControlsState, setShowControlsState] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControlsState(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (playing) {
          setShowControlsState(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setShowControlsState(true));
      container.addEventListener('mouseleave', () => {
        if (playing) setShowControlsState(false);
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      clearTimeout(controlsTimeoutRef.current);
    };
  }, [playing]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    setCurrentTime(newTime);
    playerRef.current?.seekTo(newTime, 'seconds');
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePlayPause = () => {
    if (playing) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  const skip = (seconds) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    setCurrentTime(newTime);
    playerRef.current?.seekTo(newTime, 'seconds');
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-2xl overflow-hidden group ${className}`}
    >
      {/* Video */}
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        width="100%"
        height="100%"
        onDuration={setDuration}
        onProgress={(state) => {
          if (!seeking) {
            setCurrentTime(state.playedSeconds);
          }
          onProgress?.(state);
        }}
        onEnded={onEnded}
        onBuffer={() => setBuffering(true)}
        onBufferEnd={() => setBuffering(false)}
        config={{
          youtube: {
            playerVars: {
              autoplay: 0,
              controls: 0,
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
              showinfo: 0,
            },
          },
        }}
      />

      {/* Loading State */}
      <AnimatePresence>
        {buffering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      {showControls && (
        <AnimatePresence>
          {(showControlsState || !playing) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
            >
              {/* Center Play/Pause Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlayPause}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center
                           hover:bg-white/30 transition-colors"
                >
                  {playing ? (
                    <Pause className="w-8 h-8 text-white ml-0" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </motion.button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div 
                  className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-4 group/progress"
                  onClick={handleSeek}
                  onMouseDown={() => setSeeking(true)}
                  onMouseUp={() => setSeeking(false)}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full
                                  opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Play/Pause */}
                    <button
                      onClick={handlePlayPause}
                      className="text-white hover:scale-110 transition-transform"
                    >
                      {playing ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>

                    {/* Skip Buttons */}
                    <button
                      onClick={() => skip(-10)}
                      className="text-white hover:scale-110 transition-transform"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => skip(10)}
                      className="text-white hover:scale-110 transition-transform"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-2 group/volume">
                      <button
                        onClick={() => setMuted(!muted)}
                        className="text-white hover:scale-110 transition-transform"
                      >
                        {muted || volume === 0 ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={muted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-white"
                      />
                    </div>

                    {/* Time */}
                    <div className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Settings */}
                    <button className="text-white hover:scale-110 transition-transform">
                      <Settings className="w-5 h-5" />
                    </button>

                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="text-white hover:scale-110 transition-transform"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default VideoPlayer;