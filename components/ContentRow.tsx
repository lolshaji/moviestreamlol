import React, { useRef, useState, useEffect } from 'react';
import { Content } from '../types';
import ContentCard from './ContentCard';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface ContentRowProps {
  title: string;
  content: Content[];
  onCardClick: (content: Content) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, content, onCardClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScrollability = () => {
      const el = scrollRef.current;
      if (el) {
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1); // -1 for precision
      }
    };
    checkScrollability(); // Initial check
    
    const currentRef = scrollRef.current;
    currentRef?.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);

    return () => {
      currentRef?.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [content]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-8 md:mb-12">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 sm:px-6 lg:px-8">
        {title}
      </h2>
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/50 hover:bg-black/70 transition-opacity duration-300 flex items-center justify-center disabled:opacity-0 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
        >
          <ChevronLeftIcon className="w-8 h-8 text-white" />
        </button>
        
        <div ref={scrollRef} className="flex items-stretch space-x-2 sm:space-x-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8">
          {content.map(item => (
            <ContentCard key={`${item.type}-${item.id}`} content={item} onClick={onCardClick} />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/50 hover:bg-black/70 transition-opacity duration-300 flex items-center justify-center disabled:opacity-0 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
        >
          <ChevronRightIcon className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;