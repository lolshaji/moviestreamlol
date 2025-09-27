import React from 'react';
import { Content } from '../types';

interface ContentCardProps {
  content: Content;
  onClick: (content: Content) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onClick }) => {
  return (
    <div 
      className="group relative flex-shrink-0 w-36 sm:w-40 md:w-48 lg:w-56 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:z-20"
      onClick={() => onClick(content)}
    >
      <div className="aspect-[2/3] bg-brand-dark rounded-md overflow-hidden shadow-lg group-hover:shadow-brand-red/30 transition-shadow">
        <img
          src={content.posterPath}
          alt={content.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex items-end p-2">
        <h3 className="text-white text-sm font-semibold line-clamp-2">{content.title}</h3>
      </div>
    </div>
  );
};

export default ContentCard;
