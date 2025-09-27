import React, { useMemo } from 'react';
import Hero from './Hero';
import ContentRow from './ContentRow';
import { Content, Movie, TVShow, Episode } from '../types';

interface HomePageProps {
    content: Content[];
    onCardClick: (content: Content) => void;
    onPlayClick: (payload: { movie: Movie } | { show: TVShow, episode: Episode }) => void;
}

const HomePage: React.FC<HomePageProps> = ({ content, onCardClick, onPlayClick }) => {
    
    const featuredContent = useMemo(() => {
      if (content.length === 0) return null;
      // Prefer a TV show with a backdrop for the hero
      return content.find(c => c.type === 'tv' && c.backdropPath) || content[0];
    }, [content]);

    const contentByGenre = useMemo<{ [key: string]: Content[] }>(() => {
        // FIX: Explicitly type `genres` as `string[]` to prevent `genre` from being inferred as `unknown`.
        const genres: string[] = [...new Set(content.flatMap(item => item.genres))];
        const grouped: { [key: string]: Content[] } = {};
        
        grouped['Trending Now'] = [...content].sort((a,b) => b.rating - a.rating).slice(0, 10);
        
        genres.forEach(genre => {
            grouped[genre] = content.filter(item => item.genres.includes(genre));
        });
        return grouped;
    }, [content]);

    return (
        <>
            {featuredContent && <Hero content={featuredContent} onMoreInfoClick={onCardClick} onPlayClick={onPlayClick} />}
            <div className="pt-8">
                {/* FIX: `items` was being inferred as `unknown` from Object.entries. Using Object.keys ensures correct type inference. */}
                {Object.keys(contentByGenre).map(genre => {
                    const items = contentByGenre[genre];
                    return items.length > 0 ? (
                        <ContentRow
                        key={genre}
                        title={genre}
                        content={items}
                        onCardClick={onCardClick}
                        />
                    ) : null;
                })}
            </div>
        </>
    );
};

export default HomePage;