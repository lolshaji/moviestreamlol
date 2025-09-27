import React, { useState, useEffect, useMemo } from 'react';
import { Content } from '../types';
import CloseIcon from './icons/CloseIcon';
import ContentCard from './ContentCard';

interface SearchOverlayProps {
  content: Content[];
  onClose: () => void;
  onCardClick: (content: Content) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ content, onClose, onCardClick }) => {
  const [query, setQuery] = useState('');
  
  const filteredContent = useMemo(() => {
    if (!query) {
      return [];
    }
    return content.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, content]);

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex flex-col p-4 animate-fade-in">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-300">Search for Movies or TV Shows</h2>
            <button onClick={onClose} className="text-white hover:text-brand-red">
                <CloseIcon className="w-8 h-8" />
            </button>
        </div>
        <div className="relative mt-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Action, The Quantum Paradox, etc."
            className="w-full bg-brand-dark border-2 border-gray-700 rounded-full py-3 px-6 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-red/70 transition search-box"
            autoFocus
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto mt-8 scrollbar-hide">
        {query && (
          <div className="max-w-7xl mx-auto">
            {filteredContent.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredContent.map(item => (
                        <ContentCard key={`${item.type}-${item.id}`} content={item} onClick={onCardClick} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 mt-16 text-lg">No results found for "{query}"</p>
            )}
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .search-box:focus {
            box-shadow: 0 0 25px 5px rgba(229, 9, 20, 0.4);
        }
      `}</style>
    </div>
  );
};

export default SearchOverlay;
