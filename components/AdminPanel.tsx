import React, { useState, useEffect } from 'react';
import { Content, Movie, TVShow, Season, Episode } from '../types';
import { generateMovieDetails, generateTVShowDetails } from '../services/geminiService';
import { correctDropboxUrl } from '../utils/urlUtils';

interface AdminPanelProps {
  content: Content[];
  onAddMovie: (data: Omit<Movie, 'id' | 'type'>) => void;
  onUpdateMovie: (data: Omit<Movie, 'type'>) => void;
  onAddTVShow: (data: Omit<TVShow, 'id' | 'type'>) => void;
  onUpdateTVShow: (data: Omit<TVShow, 'type'>) => void;
  onDeleteContent: (id: number) => void;
}

const REQUESTS_STORAGE_KEY = 'theldenRequests';

interface MovieRequest {
    id: number;
    requestText: string;
    userEmail: string;
    date: string;
}

const initialMovieData: Omit<Movie, 'id' | 'type'> = {
  title: '', description: '', genres: [], rating: 0, releaseYear: 0, posterPath: '', backdropPath: '', videoSources: [], subtitleUrl: ''
};
const initialTVShowData: Omit<TVShow, 'id' | 'type'> = {
  title: '', description: '', genres: [], rating: 0, releaseYear: 0, posterPath: '', backdropPath: '', seasons: []
};

const AdminPanel: React.FC<AdminPanelProps> = ({ content, onAddMovie, onUpdateMovie, onAddTVShow, onUpdateTVShow, onDeleteContent }) => {
  const [formMode, setFormMode] = useState<'movie' | 'tv'>('movie');
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  
  const [movieData, setMovieData] = useState(initialMovieData);
  const [tvShowData, setTVShowData] = useState(initialTVShowData);
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState<MovieRequest[]>([]);

  useEffect(() => {
    if (editingContent) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if(editingContent.type === 'movie'){
        setFormMode('movie');
        setMovieData({
          ...editingContent,
          genres: editingContent.genres || [],
          videoSources: editingContent.videoSources || [],
        });
      } else {
        setFormMode('tv');
        setTVShowData({
          ...editingContent,
          seasons: editingContent.seasons.map(s => ({...s, episodes: s.episodes.map(e => ({...e, videoSources: e.videoSources || []}))}))
        });
      }
    } else {
      setMovieData(initialMovieData);
      setTVShowData(initialTVShowData);
    }
  }, [editingContent]);

    useEffect(() => {
        try {
            const storedRequests = localStorage.getItem(REQUESTS_STORAGE_KEY);
            if (storedRequests) {
                setRequests(JSON.parse(storedRequests));
            }
        } catch (error) {
            console.error("Failed to load movie requests:", error);
            setRequests([]);
        }
    }, []);

    const handleDismissRequest = (id: number) => {
        const updatedRequests = requests.filter(req => req.id !== id);
        setRequests(updatedRequests);
        localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(updatedRequests));
    };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setter: React.Dispatch<React.SetStateAction<any>>) => {
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) { setError('Please enter a prompt for the AI.'); return; }
    setIsGenerating(true);
    setError('');
    try {
      if (formMode === 'movie') {
        const details = await generateMovieDetails(aiPrompt);
        setMovieData(prev => ({ ...prev, ...details, genres: details.genres || [], videoSources: prev.videoSources }));
      } else {
        const details = await generateTVShowDetails(aiPrompt);
        setTVShowData(prev => ({...prev, ...details, genres: details.genres || [], seasons: prev.seasons}));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForms = () => {
    setEditingContent(null);
    setMovieData(initialMovieData);
    setTVShowData(initialTVShowData);
    setAiPrompt('');
    setError('');
  }

  const handleMovieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
        ...movieData,
        genres: typeof movieData.genres === 'string' ? (movieData.genres as string).split(',').map(g => g.trim()) : movieData.genres,
        rating: Number(movieData.rating),
        releaseYear: Number(movieData.releaseYear),
        posterPath: correctDropboxUrl(movieData.posterPath),
        backdropPath: correctDropboxUrl(movieData.backdropPath),
        videoSources: movieData.videoSources.map(vs => ({...vs, url: correctDropboxUrl(vs.url)})),
        subtitleUrl: movieData.subtitleUrl ? correctDropboxUrl(movieData.subtitleUrl) : undefined,
    };
    if (editingContent) {
      onUpdateMovie({ id: editingContent.id, ...data });
    } else {
      onAddMovie(data);
    }
    resetForms();
  }
  
  const handleTVShowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...tvShowData,
      genres: typeof tvShowData.genres === 'string' ? (tvShowData.genres as string).split(',').map(g => g.trim()) : tvShowData.genres,
      rating: Number(tvShowData.rating),
      releaseYear: Number(tvShowData.releaseYear),
      posterPath: correctDropboxUrl(tvShowData.posterPath),
      backdropPath: correctDropboxUrl(tvShowData.backdropPath),
      seasons: tvShowData.seasons.map(season => ({
        ...season,
        episodes: season.episodes.map(episode => ({
          ...episode,
          videoSources: episode.videoSources.map(vs => ({...vs, url: correctDropboxUrl(vs.url)})),
          subtitleUrl: episode.subtitleUrl ? correctDropboxUrl(episode.subtitleUrl) : undefined,
          thumbnailPath: correctDropboxUrl(episode.thumbnailPath)
        }))
      }))
    }
    if(editingContent){
      onUpdateTVShow({id: editingContent.id, ...data});
    } else {
      onAddTVShow(data);
    }
    resetForms();
  }

  // Movie Form video source handlers
  const handleMovieSourceChange = (index: number, field: 'quality' | 'url', value: string) => {
    const newSources = [...movieData.videoSources];
    newSources[index] = { ...newSources[index], [field]: value };
    setMovieData(prev => ({...prev, videoSources: newSources}));
  };
  const addMovieSource = () => setMovieData(prev => ({...prev, videoSources: [...prev.videoSources, { quality: '', url: '' }]}));
  const removeMovieSource = (index: number) => setMovieData(prev => ({...prev, videoSources: prev.videoSources.filter((_, i) => i !== index)}));

  // TV Form dynamic handlers
  const handleTVShowDataChange = (field: keyof Omit<TVShow, 'id'|'type'>, value: any) => setTVShowData(prev => ({...prev, [field]: value}));
  const handleSeasonChange = (seasonIndex: number, field: keyof Season, value: any) => {
    const newSeasons = [...tvShowData.seasons];
    newSeasons[seasonIndex] = {...newSeasons[seasonIndex], [field]: value};
    handleTVShowDataChange('seasons', newSeasons);
  };
  const handleEpisodeChange = (seasonIndex: number, episodeIndex: number, field: keyof Episode, value: any) => {
    const newSeasons = [...tvShowData.seasons];
    const newEpisodes = [...newSeasons[seasonIndex].episodes];
    newEpisodes[episodeIndex] = {...newEpisodes[episodeIndex], [field]: value};
    handleSeasonChange(seasonIndex, 'episodes', newEpisodes);
  };
  const handleEpisodeSourceChange = (sIdx: number, eIdx: number, srcIdx: number, field: 'quality' | 'url', value: string) => {
      const newSeasons = [...tvShowData.seasons];
      const newEpisodes = [...newSeasons[sIdx].episodes];
      const newSources = [...newEpisodes[eIdx].videoSources];
      newSources[srcIdx] = {...newSources[srcIdx], [field]: value };
      handleEpisodeChange(sIdx, eIdx, 'videoSources', newSources);
  };
  const addEpisodeSource = (sIdx: number, eIdx: number) => {
      const newSources = [...tvShowData.seasons[sIdx].episodes[eIdx].videoSources, { quality: '', url: '' }];
      handleEpisodeChange(sIdx, eIdx, 'videoSources', newSources);
  }
  const removeEpisodeSource = (sIdx: number, eIdx: number, srcIdx: number) => {
      const newSources = tvShowData.seasons[sIdx].episodes[eIdx].videoSources.filter((_, i) => i !== srcIdx);
      handleEpisodeChange(sIdx, eIdx, 'videoSources', newSources);
  }

  const addSeason = () => {
    const newSeason: Season = { seasonNumber: tvShowData.seasons.length + 1, episodes: [] };
    handleTVShowDataChange('seasons', [...tvShowData.seasons, newSeason]);
  };
  const removeSeason = (seasonIndex: number) => {
    const newSeasons = tvShowData.seasons.filter((_, idx) => idx !== seasonIndex).map((s, i) => ({...s, seasonNumber: i+1}));
    handleTVShowDataChange('seasons', newSeasons);
  };
  const addEpisode = (seasonIndex: number) => {
    const newEpisode: Episode = { id: Date.now(), episodeNumber: tvShowData.seasons[seasonIndex].episodes.length + 1, title: '', description: '', thumbnailPath: '', videoSources: [], duration: 0};
    const updatedEpisodes = [...tvShowData.seasons[seasonIndex].episodes, newEpisode];
    handleSeasonChange(seasonIndex, 'episodes', updatedEpisodes);
  };
  const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
    const newEpisodes = tvShowData.seasons[seasonIndex].episodes.filter((_, idx) => idx !== episodeIndex).map((e, i) => ({...e, episodeNumber: i+1}));
    handleSeasonChange(seasonIndex, 'episodes', newEpisodes);
  };


  const renderMovieForm = () => (
    <form onSubmit={handleMovieSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">{editingContent ? 'Edit Movie Details' : '2. Fill in Movie Details'}</label>
      <input type="text" name="title" value={movieData.title} onChange={e => handleInputChange(e, setMovieData)} placeholder="Title" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required/>
      <textarea name="description" value={movieData.description} onChange={e => handleInputChange(e, setMovieData)} placeholder="Description" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" rows={3} required/>
      <input type="text" name="posterPath" value={movieData.posterPath} onChange={e => handleInputChange(e, setMovieData)} placeholder="Poster Image URL (e.g., Dropbox link)" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required />
      <input type="text" name="backdropPath" value={movieData.backdropPath} onChange={e => handleInputChange(e, setMovieData)} placeholder="Backdrop Image URL (e.g., Dropbox link)" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required />
      
      <div className="space-y-3 bg-gray-800/50 p-3 rounded-md">
          <label className="text-sm font-medium text-gray-300">Video Sources</label>
          {movieData.videoSources.map((source, index) => (
              <div key={index} className="flex items-center space-x-2">
                  <input type="text" value={source.quality} onChange={e => handleMovieSourceChange(index, 'quality', e.target.value)} placeholder="Quality (e.g., 720p)" className="w-1/4 bg-gray-600 p-1.5 rounded-md text-sm" required />
                  <input type="text" value={source.url} onChange={e => handleMovieSourceChange(index, 'url', e.target.value)} placeholder="Video URL" className="flex-grow bg-gray-600 p-1.5 rounded-md text-sm" required />
                  <button type="button" onClick={() => removeMovieSource(index)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
              </div>
          ))}
          <button type="button" onClick={addMovieSource} className="text-sm bg-blue-600/50 hover:bg-blue-600/80 px-3 py-1 rounded-md transition">Add Source</button>
      </div>

      <input type="text" name="subtitleUrl" value={movieData.subtitleUrl || ''} onChange={e => handleInputChange(e, setMovieData)} placeholder="Subtitle URL (Optional, e.g., Dropbox link to .vtt)" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" />
      <input type="text" name="genres" value={Array.isArray(movieData.genres) ? movieData.genres.join(', ') : movieData.genres} onChange={e => handleInputChange(e, setMovieData)} placeholder="Genres (comma-separated)" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required/>
      <div className="flex space-x-4">
        <input type="number" step="0.1" min="1" max="10" name="rating" value={movieData.rating} onChange={e => handleInputChange(e, setMovieData)} placeholder="Rating (e.g., 8.5)" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required/>
        <input type="number" min="1900" max={new Date().getFullYear() + 5} name="releaseYear" value={movieData.releaseYear} onChange={e => handleInputChange(e, setMovieData)} placeholder="Release Year" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required/>
      </div>
      <div className="flex space-x-4 pt-4">
        <button type="submit" className="w-full bg-green-600 py-2 rounded-md hover:bg-green-700 transition font-semibold">{editingContent ? 'Update Movie' : 'Add Movie'}</button>
        {editingContent && <button type="button" onClick={resetForms} className="w-full bg-gray-600 py-2 rounded-md hover:bg-gray-700 transition font-semibold">Cancel Edit</button>}
      </div>
    </form>
  );

  const renderTVShowForm = () => (
    <form onSubmit={handleTVShowSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">{editingContent ? 'Edit TV Show Details' : '2. Fill in TV Show Details'}</label>
      {/* Basic Info */}
      <input type="text" name="title" value={tvShowData.title} onChange={e => handleInputChange(e, setTVShowData)} placeholder="Show Title" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required/>
      <textarea name="description" value={tvShowData.description} onChange={e => handleInputChange(e, setTVShowData)} placeholder="Show Description" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" rows={3} required/>
      <input type="text" name="posterPath" value={tvShowData.posterPath} onChange={e => handleInputChange(e, setTVShowData)} placeholder="Poster URL" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required/>
      <input type="text" name="backdropPath" value={tvShowData.backdropPath} onChange={e => handleInputChange(e, setTVShowData)} placeholder="Backdrop URL" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required/>
      <input type="text" name="genres" value={Array.isArray(tvShowData.genres) ? tvShowData.genres.join(', ') : tvShowData.genres} onChange={e => handleInputChange(e, setTVShowData)} placeholder="Genres (comma-separated)" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required/>
      <div className="flex space-x-4">
        <input type="number" step="0.1" min="1" max="10" name="rating" value={tvShowData.rating} onChange={e => handleInputChange(e, setTVShowData)} placeholder="Rating" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required/>
        <input type="number" min="1900" max={new Date().getFullYear() + 5} name="releaseYear" value={tvShowData.releaseYear} onChange={e => handleInputChange(e, setTVShowData)} placeholder="Release Year" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" required/>
      </div>

      {/* Seasons and Episodes */}
      <div className="space-y-6 pt-4">
        {tvShowData.seasons.map((season, sIdx) => (
          <div key={sIdx} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-200">Season {season.seasonNumber}</h4>
              <button type="button" onClick={() => removeSeason(sIdx)} className="text-red-400 hover:text-red-300 text-sm">Remove Season</button>
            </div>
            {season.episodes.map((episode, eIdx) => (
              <div key={eIdx} className="bg-gray-700/50 p-3 rounded-md mb-3 space-y-2 border-l-2 border-brand-red/50">
                 <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-300">Episode {episode.episodeNumber}</p>
                    <button type="button" onClick={() => removeEpisode(sIdx, eIdx)} className="text-red-500 hover:text-red-400 text-xs">Remove</button>
                </div>
                <input type="text" value={episode.title} onChange={e => handleEpisodeChange(sIdx, eIdx, 'title', e.target.value)} placeholder="Episode Title" className="w-full bg-gray-600 p-1.5 rounded-md text-sm" required/>
                <textarea value={episode.description} onChange={e => handleEpisodeChange(sIdx, eIdx, 'description', e.target.value)} placeholder="Episode Description" className="w-full bg-gray-600 p-1.5 rounded-md text-sm" rows={2} required/>
                <input type="text" value={episode.thumbnailPath} onChange={e => handleEpisodeChange(sIdx, eIdx, 'thumbnailPath', e.target.value)} placeholder="Thumbnail URL" className="w-full bg-gray-600 p-1.5 rounded-md text-sm" required/>
                
                <div className="space-y-2 bg-gray-600/50 p-2 rounded-md">
                    <label className="text-xs font-medium text-gray-300">Video Sources</label>
                    {episode.videoSources.map((source, srcIdx) => (
                        <div key={srcIdx} className="flex items-center space-x-2">
                             <input type="text" value={source.quality} onChange={e => handleEpisodeSourceChange(sIdx, eIdx, srcIdx, 'quality', e.target.value)} placeholder="Quality" className="w-1/4 bg-gray-500 p-1 rounded-md text-xs" required />
                            <input type="text" value={source.url} onChange={e => handleEpisodeSourceChange(sIdx, eIdx, srcIdx, 'url', e.target.value)} placeholder="URL" className="flex-grow bg-gray-500 p-1 rounded-md text-xs" required />
                            <button type="button" onClick={() => removeEpisodeSource(sIdx, eIdx, srcIdx)} className="text-red-400 hover:text-red-300 text-xs">X</button>
                        </div>
                    ))}
                     <button type="button" onClick={() => addEpisodeSource(sIdx, eIdx)} className="text-xs bg-blue-600/50 hover:bg-blue-600/80 px-2 py-0.5 rounded-md transition">Add Source</button>
                </div>

                <input type="text" value={episode.subtitleUrl || ''} onChange={e => handleEpisodeChange(sIdx, eIdx, 'subtitleUrl', e.target.value)} placeholder="Subtitle URL (Optional)" className="w-full bg-gray-600 p-1.5 rounded-md text-sm" />
                <input type="number" value={episode.duration} onChange={e => handleEpisodeChange(sIdx, eIdx, 'duration', Number(e.target.value))} placeholder="Duration (mins)" className="w-full bg-gray-600 p-1.5 rounded-md text-sm" required/>
              </div>
            ))}
            <button type="button" onClick={() => addEpisode(sIdx)} className="mt-2 text-sm bg-blue-600/50 hover:bg-blue-600/80 px-3 py-1 rounded-md transition">Add Episode</button>
          </div>
        ))}
        <button type="button" onClick={addSeason} className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-md transition font-semibold">Add Season</button>
      </div>

      <div className="flex space-x-4 pt-4">
        <button type="submit" className="w-full bg-green-600 py-2 rounded-md hover:bg-green-700 transition font-semibold">{editingContent ? 'Update TV Show' : 'Add TV Show'}</button>
        {editingContent && <button type="button" onClick={resetForms} className="w-full bg-gray-600 py-2 rounded-md hover:bg-gray-700 transition font-semibold">Cancel Edit</button>}
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-brand-red">Admin Panel</h1>
        
        <div className="bg-brand-dark p-6 rounded-lg mb-12">
          <div className='flex items-center border-b border-gray-700 mb-6'>
            <button onClick={() => { setFormMode('movie'); resetForms(); }} className={`px-4 py-2 text-lg font-semibold transition ${formMode === 'movie' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-400'}`}>Movie</button>
            <button onClick={() => { setFormMode('tv'); resetForms(); }} className={`px-4 py-2 text-lg font-semibold transition ${formMode === 'tv' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-400'}`}>TV Show</button>
          </div>
          <h2 className="text-2xl font-semibold mb-6">{editingContent ? `Editing: ${editingContent.title}` : `Add New ${formMode === 'movie' ? 'Movie' : 'TV Show'}`}</h2>
          {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">{error}</div>}
          
          {!editingContent && (
            <div className="mb-6 space-y-4 bg-gray-800/50 p-4 rounded-md">
                <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-300">1. (Optional) Generate Details with AI</label>
                <textarea id="ai-prompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder={`e.g., A sci-fi ${formMode} about a talking dog`} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red transition" rows={2}/>
                <button onClick={handleAiGenerate} disabled={isGenerating} className="bg-brand-red px-4 py-2 rounded-md hover:bg-red-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isGenerating ? 'Generating...' : 'Generate Details'}
                </button>
            </div>
          )}

          {formMode === 'movie' ? renderMovieForm() : renderTVShowForm()}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Manage Existing Content</h2>
          <div className="space-y-4">
            {content.map(item => (
              <div key={`${item.type}-${item.id}`} className="bg-brand-dark p-4 rounded-lg flex items-center justify-between">
                <div className='flex items-center'>
                  <img src={item.posterPath} alt={item.title} className="w-12 h-18 object-cover rounded-md mr-4" />
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-gray-400 capitalize">{item.type}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => setEditingContent(item)} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition">
                        Edit
                    </button>
                    <button onClick={() => onDeleteContent(item.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition">
                        Delete
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">User Movie/TV Show Requests</h2>
          <div className="space-y-4">
            {requests.length > 0 ? (
                requests.map(req => (
                    <div key={req.id} className="bg-brand-dark p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-bold text-lg">{req.requestText}</p>
                            <p className="text-sm text-gray-400">Requested by: {req.userEmail} on {req.date}</p>
                        </div>
                        <button onClick={() => handleDismissRequest(req.id)} className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition text-sm font-semibold">
                            Dismiss
                        </button>
                    </div>
                ))
            ) : (
                <div className="bg-brand-dark p-4 rounded-lg">
                    <p className="text-gray-500">No pending requests.</p>
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;