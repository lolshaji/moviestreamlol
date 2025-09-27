import React, { useState, useRef, useEffect } from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { Movie, TVShow, Episode } from '../types';
import CCIcon from './icons/CCIcon';
import NextEpisodeIcon from './icons/NextEpisodeIcon';
import FullScreenIcon from './icons/FullScreenIcon';
import ExitFullScreenIcon from './icons/ExitFullScreenIcon';
import RewindIcon from './icons/RewindIcon';
import ForwardIcon from './icons/ForwardIcon';
import SettingsIcon from './icons/SettingsIcon';


const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
);
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
);
const VolumeUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" /><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" /></svg>
);
const VolumeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.94 12l-2.22 2.22a.75.75 0 101.06 1.06L20 13.06l2.22 2.22a.75.75 0 001.06-1.06L21.06 12l2.22-2.22a.75.75 0 00-1.06-1.06L20 10.94l-2.22-2.22z" /></svg>
);

type PlayingState = { movie: Movie, blobUrl?: string } | { show: TVShow, episode: Episode, blobUrl?: string };

interface PlayerProps {
  playingState: PlayingState;
  onClose: () => void;
  onNextEpisode: () => void;
}

const Player: React.FC<PlayerProps> = ({ playingState, onClose, onNextEpisode }) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const lastTapRef = useRef({ time: 0, side: '' });

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSkipAnimation, setShowSkipAnimation] = useState<'forward' | 'rewind' | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { title, videoSources, subtitleUrl, blobUrl } = 'movie' in playingState 
    ? { title: playingState.movie.title, videoSources: playingState.movie.videoSources, subtitleUrl: playingState.movie.subtitleUrl, blobUrl: playingState.blobUrl }
    : { title: `${playingState.show.title}`, videoSources: playingState.episode.videoSources, subtitleUrl: playingState.episode.subtitleUrl, blobUrl: playingState.blobUrl };
  
  const [selectedQuality, setSelectedQuality] = useState(videoSources[0]?.quality || 'auto');

  const videoUrl = blobUrl || videoSources.find(s => s.quality === selectedQuality)?.url || videoSources[0]?.url;

  useEffect(() => {
    // Cleanup object URL to prevent memory leaks
    return () => {
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
        }
    }
  }, [blobUrl]);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const seek = (time: number) => {
    if (videoRef.current) {
        videoRef.current.currentTime += time;
        if (time > 0) setShowSkipAnimation('forward');
        else setShowSkipAnimation('rewind');
        setTimeout(() => setShowSkipAnimation(null), 500);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hideControls = () => {
        setShowControls(false);
        setIsSettingsOpen(false);
    }
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if(isPlaying) controlsTimeoutRef.current = window.setTimeout(hideControls, 3000);
    };

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (video.textTracks.length > 0) {
        video.textTracks[0].mode = subtitlesEnabled ? 'showing' : 'hidden';
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === " ") togglePlay();
        if(e.key === "f") toggleFullScreen();
        if(e.key === 'ArrowRight') seek(10);
        if(e.key === 'ArrowLeft') seek(-10);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, subtitlesEnabled]);

  const togglePlay = () => setIsPlaying(p => !p);

  useEffect(() => {
    if (videoRef.current) {
        isPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
  }, [isPlaying]);
  
  // Subtitle toggle effect
  useEffect(() => {
      const video = videoRef.current;
      if (video && video.textTracks && video.textTracks.length > 0) {
        video.textTracks[0].mode = subtitlesEnabled ? 'showing' : 'hidden';
      }
  }, [subtitlesEnabled])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
        const progressBar = e.currentTarget;
        const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
        videoRef.current.currentTime = (clickPosition / progressBar.offsetWidth) * duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if(videoRef.current) videoRef.current.volume = newVolume;
  }

  const toggleMute = () => {
    if(videoRef.current) {
        if(isMuted || volume === 0) {
            const newVolume = volume > 0 ? volume : 0.5;
            setVolume(newVolume);
            videoRef.current.volume = newVolume;
            setIsMuted(false);
        } else {
            videoRef.current.volume = 0;
            setIsMuted(true);
        }
    }
  }

  const handleQualityChange = (newQuality: string) => {
    const newSource = videoSources.find(s => s.quality === newQuality);
    if (newSource && videoRef.current && newQuality !== selectedQuality) {
        const currentPlayTime = videoRef.current.currentTime;
        const wasPlaying = !videoRef.current.paused;
        videoRef.current.src = newSource.url;
        videoRef.current.load();
        
        const onLoadedData = () => {
            videoRef.current.currentTime = currentPlayTime;
            if (wasPlaying) {
                videoRef.current.play();
            }
        };
        videoRef.current.addEventListener('loadeddata', onLoadedData, { once: true });
        
        setSelectedQuality(newQuality);
    }
    setIsSettingsOpen(false);
  };


  const toggleSubtitles = () => setSubtitlesEnabled(prev => !prev);
  
  const getEpisodeTitle = () => {
    if ('episode' in playingState) {
        const { episode } = playingState;
        const season = playingState.show.seasons.find(s => s.episodes.some(e => e.id === episode.id));
        return `S${season?.seasonNumber}:E${episode.episodeNumber} "${episode.title}"`;
    }
    return null;
  }

  const hasNextEpisode = () => {
    if ('show' in playingState && !playingState.blobUrl) { // No next episode for offline playback for now
        const { show, episode } = playingState;
        const currentSeason = show.seasons.find(s => s.episodes.some(e => e.id === episode.id));
        if (currentSeason) {
            const currentEpisodeIndex = currentSeason.episodes.findIndex(e => e.id === episode.id);
            return currentEpisodeIndex > -1 && currentEpisodeIndex < currentSeason.episodes.length - 1;
        }
    }
    return false;
  };
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        playerContainerRef.current?.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handleTap = (side: 'left' | 'right') => {
    const now = Date.now();
    if (now - lastTapRef.current.time < 300 && lastTapRef.current.side === side) {
      seek(side === 'right' ? 10 : -10);
      lastTapRef.current.time = 0;
    } else {
      lastTapRef.current = { time: now, side };
    }
  };


  return (
    <div ref={playerContainerRef} className="fixed inset-0 bg-black z-[200] flex items-center justify-center animate-fade-in">
      <video ref={videoRef} src={videoUrl} className="w-full h-full object-contain" autoPlay>
        {subtitleUrl && <track kind="subtitles" src={subtitleUrl} srcLang="en" label="English" />}
      </video>
      
      {/* Tap detection overlays */}
      <div className="absolute top-0 left-0 w-1/2 h-full" onClick={() => handleTap('left')} onDoubleClick={() => { /* Double click is handled by our custom tap handler */}}></div>
      <div className="absolute top-0 right-0 w-1/2 h-full" onClick={() => handleTap('right')} onDoubleClick={() => { /* Double click is handled by our custom tap handler */}}></div>

      {/* Skip Animation Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center text-white pointer-events-none transition-opacity duration-200 ${showSkipAnimation ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/40 rounded-full p-4">
            {showSkipAnimation === 'rewind' && <RewindIcon className="w-16 h-16" />}
            {showSkipAnimation === 'forward' && <ForwardIcon className="w-16 h-16" />}
          </div>
      </div>
      
      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} onClick={togglePlay}>
        <div className="absolute inset-0" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
            <button onClick={onClose} className="absolute top-5 left-5 text-white z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 transition">
              <ArrowLeftIcon className="w-8 h-8" />
            </button>
            <div className="absolute top-5 right-5 text-white z-20 text-right">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-lg">{getEpisodeTitle()}</p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 flex flex-col space-y-3">
              <div className="w-full cursor-pointer group" onClick={handleSeek}>
                <div className="bg-white/30 h-1 group-hover:h-1.5 rounded-full transition-all">
                  <div className="bg-brand-red h-full rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <button onClick={togglePlay}>
                    {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
                  </button>
                  <div className="flex items-center space-x-2">
                     <button onClick={toggleMute}>
                        {isMuted || volume === 0 ? <VolumeOffIcon className="w-7 h-7"/> : <VolumeUpIcon className="w-7 h-7"/>}
                     </button>
                     <div className="w-24">
                        <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="volume-slider w-full" />
                     </div>
                  </div>
                   <div className="text-sm">
                    <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 relative">
                    {subtitleUrl && (
                        <button onClick={toggleSubtitles}>
                            <CCIcon className={`w-7 h-7 ${subtitlesEnabled ? 'text-white' : 'text-gray-500'}`} />
                        </button>
                    )}
                    {hasNextEpisode() && (
                        <button onClick={onNextEpisode}><NextEpisodeIcon className="w-7 h-7" /></button>
                    )}
                    {videoSources && videoSources.length > 1 && (
                      <div>
                        <button onClick={() => setIsSettingsOpen(p => !p)}>
                          <SettingsIcon className="w-7 h-7" />
                        </button>
                        {isSettingsOpen && (
                          <div className="absolute bottom-full right-0 mb-2 w-32 bg-black/80 backdrop-blur-sm rounded-md shadow-lg py-1">
                            <p className="px-3 py-1 text-sm text-gray-400">Quality</p>
                            {videoSources.map(source => (
                              <button
                                key={source.quality}
                                onClick={() => handleQualityChange(source.quality)}
                                className={`block w-full text-left px-3 py-1 text-sm ${selectedQuality === source.quality ? 'font-bold text-white' : 'text-gray-300'} hover:bg-gray-700/50`}
                              >
                                {source.quality}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                     <button onClick={toggleFullScreen}>
                        {isFullScreen ? <ExitFullScreenIcon className="w-7 h-7"/> : <FullScreenIcon className="w-7 h-7"/>}
                    </button>
                </div>
              </div>
            </div>
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; } 
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        video::cue {
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            font-family: "Helvetica Neue", "Arial", sans-serif;
            font-size: 1.5vw;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
        .volume-slider {
            -webkit-appearance: none;
            appearance: none;
            height: 5px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 5px;
            outline: none;
            cursor: pointer;
            transition: all 0.2s;
        }
        .volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            background: white;
            border-radius: 50%;
        }
        .volume-slider::-moz-range-thumb {
            width: 14px;
            height: 14px;
            background: white;
            border-radius: 50%;
            border: none;
        }
        .volume-slider:hover {
            --thumb-color: white;
        }
        .volume-slider {
            background: linear-gradient(to right, #E50914 0%, #E50914 ${isMuted ? 0 : volume * 100}%, rgba(255, 255, 255, 0.3) ${isMuted ? 0 : volume * 100}%, rgba(255, 255, 255, 0.3) 100%);
        }
      `}</style>
    </div>
  );
};

export default Player;