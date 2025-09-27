import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './auth';
import { initialContent } from './data/initialContent';
import { initialTVContent } from './data/initialTVContent';
import { Content, Movie, TVShow, Episode, DownloadedContent } from './types';
import { DownloadsProvider, useDownloads } from './hooks/useDownloads';

import Login from './components/Login';
import Header from './components/Header';
import MovieModal from './components/MovieModal';
import Player from './components/Player';
import SearchOverlay from './components/SearchOverlay';

import HomePage from './components/HomePage';
import MoviesPage from './components/MoviesPage';
import TVShowsPage from './components/TVShowsPage';
import RequestPage from './components/RequestPage';
import RateUsPage from './components/RateUsPage';
import ProfilePage from './components/ProfilePage';
import AdminPanel from './components/AdminPanel';
import DownloadsPage from './components/DownloadsPage';

const CONTENT_STORAGE_KEY = 'theldenContent';

type PlayState = { movie: Movie, isOffline?: boolean, blobUrl?: string } | { show: TVShow, episode: Episode, isOffline?: boolean, blobUrl?: string };

type Action =
  | { type: 'ADD_MOVIE'; payload: Omit<Movie, 'id' | 'type'> }
  | { type: 'UPDATE_MOVIE'; payload: Omit<Movie, 'type'> }
  | { type: 'ADD_TV_SHOW'; payload: Omit<TVShow, 'id' | 'type'> }
  | { type: 'UPDATE_TV_SHOW'; payload: Omit<TVShow, 'type'> }
  | { type: 'DELETE'; payload: { id: number } }
  | { type: 'SET_CONTENT'; payload: Content[] };

const contentReducer = (state: Content[], action: Action): Content[] => {
  switch (action.type) {
    case 'ADD_MOVIE':
      const newMovie: Movie = { ...action.payload, id: Date.now(), type: 'movie' };
      return [newMovie, ...state];
    case 'UPDATE_MOVIE':
      return state.map(item =>
        item.id === action.payload.id && item.type === 'movie'
          ? { ...action.payload, type: 'movie' }
          : item
      );
    case 'ADD_TV_SHOW':
        const newShow: TVShow = { ...action.payload, id: Date.now(), type: 'tv' };
        return [newShow, ...state];
    case 'UPDATE_TV_SHOW':
        return state.map(item =>
            item.id === action.payload.id && item.type === 'tv'
            ? { ...action.payload, type: 'tv' }
            : item
        );
    case 'DELETE':
      return state.filter(item => item.id !== action.payload.id);
    case 'SET_CONTENT':
        return action.payload;
    default:
      return state;
  }
};

const getInitialState = (): Content[] => {
    try {
        const storedContent = localStorage.getItem(CONTENT_STORAGE_KEY);
        if (storedContent) {
            return JSON.parse(storedContent);
        }
    } catch (error) {
        console.error("Failed to parse content from localStorage", error);
    }
    const defaultContent = [...initialContent, ...initialTVContent].sort(() => Math.random() - 0.5);
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(defaultContent));
    return defaultContent;
}


const MainApp: React.FC = () => {
  const [content, dispatch] = useReducer(contentReducer, [], getInitialState);
  const [page, setPage] = useState('home');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [playingContent, setPlayingContent] = useState<PlayState | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { downloads, deleteDownload, downloadingItems, cancelDownload } = useDownloads();

  // Persist content changes to localStorage
  useEffect(() => {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  // Listen for content changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === CONTENT_STORAGE_KEY && e.newValue) {
            try {
                dispatch({ type: 'SET_CONTENT', payload: JSON.parse(e.newValue) });
            } catch (error) {
                console.error("Failed to parse content from storage event", error);
            }
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAddMovie = useCallback((movie: Omit<Movie, 'id' | 'type'>) => { dispatch({ type: 'ADD_MOVIE', payload: movie }); }, []);
  const handleUpdateMovie = useCallback((movie: Omit<Movie, 'type'>) => { dispatch({ type: 'UPDATE_MOVIE', payload: movie }); }, []);
  const handleAddTVShow = useCallback((show: Omit<TVShow, 'id' | 'type'>) => { dispatch({ type: 'ADD_TV_SHOW', payload: show }); }, []);
  const handleUpdateTVShow = useCallback((show: Omit<TVShow, 'type'>) => { dispatch({ type: 'UPDATE_TV_SHOW', payload: show }); }, []);
  const handleDeleteContent = useCallback((id: number) => { dispatch({ type: 'DELETE', payload: { id } }); }, []);

  const handlePlayNextEpisode = () => {
    if (playingContent && 'show' in playingContent) {
        const { show, episode } = playingContent;
        const currentSeason = show.seasons.find(s => s.episodes.some(e => e.id === episode.id));
        if (currentSeason) {
            const currentEpisodeIndex = currentSeason.episodes.findIndex(e => e.id === episode.id);
            if (currentEpisodeIndex > -1 && currentEpisodeIndex < currentSeason.episodes.length - 1) {
                const nextEpisode = currentSeason.episodes[currentEpisodeIndex + 1];
                setPlayingContent({ show, episode: nextEpisode });
            } else {
                setPlayingContent(null);
            }
        }
    }
  };

  const handlePlayDownloadedContent = (item: DownloadedContent) => {
    const { content: downloadedItem, blobUrl } = item;
    if ('type' in downloadedItem && downloadedItem.type === 'movie') {
        setPlayingContent({ movie: downloadedItem, isOffline: true, blobUrl });
    } else if ('episodeNumber' in downloadedItem) {
        const parentShow = content.find(c => c.type === 'tv' && c.title === downloadedItem.showTitle) as TVShow;
        if (parentShow) {
            setPlayingContent({ show: parentShow, episode: downloadedItem, isOffline: true, blobUrl });
        }
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'movies':
        return <MoviesPage content={content.filter(c => c.type === 'movie')} onCardClick={setSelectedContent} />;
      case 'tvshows':
        return <TVShowsPage content={content.filter(c => c.type === 'tv')} onCardClick={setSelectedContent} />;
      case 'downloads':
        return <DownloadsPage downloads={downloads} onDelete={deleteDownload} onPlay={handlePlayDownloadedContent} downloadingItems={downloadingItems} onCancel={cancelDownload} />;
      case 'request':
        return <RequestPage />;
      case 'rateus':
        return <RateUsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPanel content={content} onAddMovie={handleAddMovie} onUpdateMovie={handleUpdateMovie} onAddTVShow={handleAddTVShow} onUpdateTVShow={handleUpdateTVShow} onDeleteContent={handleDeleteContent} />;
      case 'home':
      default:
        return <HomePage content={content} onCardClick={setSelectedContent} onPlayClick={setPlayingContent} />;
    }
  };

  return (
    <div className="bg-brand-black min-h-screen text-white">
      <Header page={page} setPage={setPage} onSearchClick={() => setIsSearchOpen(true)} />
      
      <main className="overflow-x-hidden">
        {renderPage()}
      </main>

      <MovieModal content={selectedContent} onClose={() => setSelectedContent(null)} onPlayClick={setPlayingContent}/>
      
      {playingContent && (
        <Player 
          key={'episode' in playingContent ? playingContent.episode.id : playingContent.movie.id}
          playingState={playingContent}
          onClose={() => setPlayingContent(null)}
          onNextEpisode={handlePlayNextEpisode}
        />
      )}

      {isSearchOpen && (
        <SearchOverlay
          content={content}
          onClose={() => setIsSearchOpen(false)}
          onCardClick={(content) => {
            setIsSearchOpen(false);
            setSelectedContent(content);
          }}
        />
      )}
    </div>
  );
};

const AppWithProviders: React.FC = () => {
    return (
        <DownloadsProvider>
            <MainApp />
        </DownloadsProvider>
    )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppWithProviders /> : <Login />;
}

export default App;