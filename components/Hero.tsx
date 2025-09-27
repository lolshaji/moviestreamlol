import React from 'react';
import { Content, Movie, TVShow, Episode } from '../types';
import PlayIcon from './icons/PlayIcon';
import InfoIcon from './icons/InfoIcon';

interface HeroProps {
  content: Content;
  onMoreInfoClick: (content: Content) => void;
  onPlayClick: (payload: { movie: Movie } | { show: TVShow, episode: Episode }) => void;
}

const Hero: React.FC<HeroProps> = ({ content, onMoreInfoClick, onPlayClick }) => {
  if (!content) {
    return (
        <div className="h-[56.25vw] w-full flex items-center justify-center text-white">
            Loading featured content...
        </div>
    );
  }

  const handlePlay = () => {
    if (content.type === 'movie') {
      onPlayClick({ movie: content });
    } else if (content.type === 'tv' && content.seasons[0]?.episodes[0]) {
      onPlayClick({ show: content, episode: content.seasons[0].episodes[0] });
    }
  }

  return (
    <div className="relative h-[56.25vw] min-h-[400px] max-h-[800px] w-full">
      <img
        src={content.backdropPath}
        alt={content.title}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
       <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-brand-black to-transparent"></div>
      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 w-full md:w-3/5 lg:w-1/2">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg">
          {content.title}
        </h1>
        <p className="text-white text-sm md:text-base lg:text-lg mt-4 line-clamp-3 drop-shadow-md">
          {content.description}
        </p>
        <div className="flex items-center space-x-4 mt-6">
          <button 
            onClick={handlePlay}
            className="flex items-center justify-center bg-white text-black font-semibold rounded-md px-6 py-2 hover:bg-opacity-80 transition">
            <PlayIcon className="w-6 h-6 mr-2" />
            Play
          </button>
          <button 
            onClick={() => onMoreInfoClick(content)}
            className="flex items-center justify-center bg-gray-500/70 text-white font-semibold rounded-md px-6 py-2 hover:bg-gray-500/50 transition backdrop-blur-sm">
            <InfoIcon className="w-6 h-6 mr-2" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
