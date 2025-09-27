import React, { useState, useEffect } from 'react';
import { Content, Episode, Movie, TVShow } from '../types';
import CloseIcon from './icons/CloseIcon';
import PlayIcon from './icons/PlayIcon';
import DownloadIcon from './icons/DownloadIcon';
import { useDownloads } from '../hooks/useDownloads';

interface MovieModalProps {
  content: Content | null;
  onClose: () => void;
  onPlayClick: (payload: { movie: Movie } | { show: TVShow, episode: Episode }) => void;
}

const DownloadButton: React.FC<{ item: Movie | Episode, showTitle?: string }> = ({ item, showTitle }) => {
    const { downloadingItems, startDownload, isDownloaded, cancelDownload } = useDownloads();
    const downloadInfo = downloadingItems[item.id];
    const downloaded = isDownloaded(item.id);

    if (downloaded) {
        return <span className="text-green-400 font-semibold">Downloaded</span>;
    }

    if (downloadInfo) {
        return (
             <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-700 rounded-full">
                    <div className="h-2 bg-brand-red rounded-full" style={{ width: `${downloadInfo.progress}%` }}></div>
                </div>
                <span className="text-sm text-gray-300">{downloadInfo.progress}%</span>
                <button onClick={() => cancelDownload(item.id)} className="p-1 bg-red-600/50 rounded-full hover:bg-red-600/80 transition">
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
        );
    }
    
    return (
        <button 
            onClick={() => startDownload(item, showTitle || '')}
            className="flex items-center justify-center bg-gray-500/70 text-white font-semibold rounded-md px-6 py-2 hover:bg-gray-500/50 transition backdrop-blur-sm">
            <DownloadIcon className="w-6 h-6 mr-2" />
            Download
        </button>
    )
}

const MovieModal: React.FC<MovieModalProps> = ({ content, onClose, onPlayClick }) => {
  const [activeSeason, setActiveSeason] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (content) {
      setIsClosing(false);
      if(content.type === 'tv'){
        setActiveSeason(1);
      }
    }
  }, [content]);

  if (!content) return null;
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };


  const isTV = content.type === 'tv';

  const handlePlayMovie = () => {
    if (content.type === 'movie') {
      onPlayClick({ movie: content });
      handleClose();
    }
  };

  const handlePlayEpisode = (episode: Episode) => {
    if (content.type === 'tv') {
      onPlayClick({ show: content, episode });
      handleClose();
    }
  };

  const selectedSeason = isTV ? (content as TVShow).seasons.find(s => s.seasonNumber === activeSeason) : null;

  return (
    <div 
      className={`fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-brand-dark w-full max-w-4xl rounded-lg overflow-hidden relative max-h-[90vh] flex flex-col ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-brand-red z-30 bg-brand-dark/50 rounded-full p-1"
        >
          <CloseIcon className="w-8 h-8" />
        </button>
        
        <div className="relative flex-shrink-0">
          <img src={content.backdropPath} alt={content.title} className="w-full h-auto object-cover max-h-96"/>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-brand-dark to-transparent" />
          <div className="absolute bottom-8 left-8 z-10">
            <h2 className="text-white text-4xl font-bold drop-shadow-lg">{content.title}</h2>
            {!isTV && (
              <div className="flex items-center space-x-4 mt-4">
                <button 
                  onClick={handlePlayMovie}
                  className="flex items-center justify-center bg-white text-black font-semibold rounded-md px-6 py-2 hover:bg-opacity-80 transition">
                  <PlayIcon className="w-6 h-6 mr-2" />
                  Play
                </button>
                <DownloadButton item={content as Movie} />
              </div>
            )}
          </div>
        </div>
        
        <div className="overflow-y-auto p-8 text-white">
          <div className="flex items-start">
            <div className="w-2/3 pr-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-green-400 font-semibold">{content.rating * 10}% Match</span>
                <span>{content.releaseYear}</span>
                <span className="border px-2 py-0.5 text-sm rounded">HD</span>
              </div>
              <p>{content.description}</p>
            </div>
            <div className="w-1/3">
              <p><span className="text-brand-gray">Genres: </span>{content.genres.join(', ')}</p>
            </div>
          </div>
          
          {isTV && (
            <div className="mt-8">
              <div className="border-b border-gray-700 mb-4 sticky top-[-32px] bg-brand-dark z-20 pt-1">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {(content as TVShow).seasons.map(season => (
                    <button
                      key={season.seasonNumber}
                      onClick={() => setActiveSeason(season.seasonNumber)}
                      className={`${
                        activeSeason === season.seasonNumber
                          ? 'border-brand-red text-white'
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition`}
                    >
                      Season {season.seasonNumber}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="space-y-2">
                {selectedSeason?.episodes.map(episode => (
                  <div key={episode.id} className="flex items-center p-2 rounded-lg hover:bg-gray-800/80 transition-colors">
                    <div className="flex items-center flex-grow cursor-pointer" onClick={() => handlePlayEpisode(episode)}>
                        <div className="text-xl font-bold text-gray-400 mr-4 w-8 text-center flex-shrink-0">{episode.episodeNumber}</div>
                        <img src={episode.thumbnailPath} alt={episode.title} className="w-32 h-20 object-cover rounded-md mr-4 flex-shrink-0"/>
                        <div className="flex-grow">
                        <h4 className="font-semibold">{episode.title}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2">{episode.description}</p>
                        </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <DownloadButton item={episode} showTitle={content.title}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-fade-out { animation: fadeOut 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

        .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
        .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(0); opacity: 1; } to { transform: translateY(50px); opacity: 0; } }
      `}</style>
    </div>
  );
};

export default MovieModal;
