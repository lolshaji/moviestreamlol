import React from 'react';
import { Content } from '../types';
import ContentCard from './ContentCard';

interface TVShowsPageProps {
  content: Content[];
  onCardClick: (content: Content) => void;
}

const TVShowsPage: React.FC<TVShowsPageProps> = ({ content, onCardClick }) => {
  return (
    <div className="pt-24 md:pt-32 px-4 sm:px-6 lg:px-8 pb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">All TV Shows</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {content.map(item => (
          <ContentCard key={`${item.type}-${item.id}`} content={item} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
};

export default TVShowsPage;
