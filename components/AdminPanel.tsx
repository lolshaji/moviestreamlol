import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

// ---------------- Movies ----------------
const MoviesManager: React.FC = () => {
  const [title, setTitle] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [movies, setMovies] = useState<any[]>([]);

  async function loadMovies() {
    const { data, error } = await supabase.from("movies").select("*").order("created_at", { ascending: false });
    if (!error) setMovies(data || []);
  }

  useEffect(() => { loadMovies(); }, []);

  async function handleAddMovie(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("movies").insert([{ title, poster_url: posterUrl, video_url: videoUrl, description }]);
    if (error) alert(error.message);
    else {
      alert("Movie added!");
      setTitle(""); setPosterUrl(""); setVideoUrl(""); setDescription("");
      loadMovies();
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🎬 Movies</h2>
      <form onSubmit={handleAddMovie} className="space-y-2 mb-6">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="p-2 w-full text-black"/>
        <input value={posterUrl} onChange={e => setPosterUrl(e.target.value)} placeholder="Poster URL" className="p-2 w-full text-black"/>
        <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="Video URL" className="p-2 w-full text-black"/>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="p-2 w-full text-black"/>
        <button type="submit" className="px-4 py-2 bg-red-600 rounded">Add Movie</button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {movies.map(m => (
          <div key={m.id} className="bg-gray-800 p-4 rounded">
            <img src={m.poster_url} alt={m.title} className="w-full h-48 object-cover mb-2"/>
            <h3 className="text-lg font-bold">{m.title}</h3>
            <p>{m.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------- TV Shows ----------------
const TVShowsManager: React.FC = () => {
  const [title, setTitle] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [description, setDescription] = useState("");
  const [shows, setShows] = useState<any[]>([]);

  async function loadShows() {
    const { data, error } = await supabase.from("tv_shows").select("*").order("created_at", { ascending: false });
    if (!error) setShows(data || []);
  }

  useEffect(() => { loadShows(); }, []);

  async function handleAddShow(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("tv_shows").insert([{ title, poster_url: posterUrl, description }]);
    if (error) alert(error.message);
    else {
      alert("TV Show added!");
      setTitle(""); setPosterUrl(""); setDescription("");
      loadShows();
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📺 TV Shows</h2>
      <form onSubmit={handleAddShow} className="space-y-2 mb-6">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="p-2 w-full text-black"/>
        <input value={posterUrl} onChange={e => setPosterUrl(e.target.value)} placeholder="Poster URL" className="p-2 w-full text-black"/>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="p-2 w-full text-black"/>
        <button type="submit" className="px-4 py-2 bg-red-600 rounded">Add TV Show</button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {shows.map(s => (
          <div key={s.id} className="bg-gray-800 p-4 rounded">
            <img src={s.poster_url} alt={s.title} className="w-full h-48 object-cover mb-2"/>
            <h3 className="text-lg font-bold">{s.title}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------- Seasons ----------------
const SeasonsManager: React.FC = () => {
  const [tvShowId, setTvShowId] = useState("");
  const [seasonNumber, setSeasonNumber] = useState("");
  const [title, setTitle] = useState("");
  const [seasons, setSeasons] = useState<any[]>([]);

  async function loadSeasons() {
    const { data, error } = await supabase.from("seasons").select("*").order("created_at", { ascending: false });
    if (!error) setSeasons(data || []);
  }

  useEffect(() => { loadSeasons(); }, []);

  async function handleAddSeason(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("seasons").insert([{ tv_show_id: tvShowId, season_number: seasonNumber, title }]);
    if (error) alert(error.message);
    else {
      alert("Season added!");
      setTvShowId(""); setSeasonNumber(""); setTitle("");
      loadSeasons();
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📂 Seasons</h2>
      <form onSubmit={handleAddSeason} className="space-y-2 mb-6">
        <input value={tvShowId} onChange={e => setTvShowId(e.target.value)} placeholder="TV Show ID" className="p-2 w-full text-black"/>
        <input value={seasonNumber} onChange={e => setSeasonNumber(e.target.value)} placeholder="Season Number" className="p-2 w-full text-black"/>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="p-2 w-full text-black"/>
        <button type="submit" className="px-4 py-2 bg-red-600 rounded">Add Season</button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {seasons.map(s => (
          <div key={s.id} className="bg-gray-800 p-4 rounded">
            <h3 className="text-lg font-bold">S{s.season_number} - {s.title}</h3>
            <p>TV Show ID: {s.tv_show_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------- Episodes ----------------
const EpisodesManager: React.FC = () => {
  const [seasonId, setSeasonId] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [episodes, setEpisodes] = useState<any[]>([]);

  async function loadEpisodes() {
    const { data, error } = await supabase.from("episodes").select("*").order("created_at", { ascending: false });
    if (!error) setEpisodes(data || []);
  }

  useEffect(() => { loadEpisodes(); }, []);

  async function handleAddEpisode(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("episodes").insert([{ season_id: seasonId, episode_number: episodeNumber, title, video_url: videoUrl }]);
    if (error) alert(error.message);
    else {
      alert("Episode added!");
      setSeasonId(""); setEpisodeNumber(""); setTitle(""); setVideoUrl("");
      loadEpisodes();
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🎞 Episodes</h2>
      <form onSubmit={handleAddEpisode} className="space-y-2 mb-6">
        <input value={seasonId} onChange={e => setSeasonId(e.target.value)} placeholder="Season ID" className="p-2 w-full text-black"/>
        <input value={episodeNumber} onChange={e => setEpisodeNumber(e.target.value)} placeholder="Episode Number" className="p-2 w-full text-black"/>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="p-2 w-full text-black"/>
        <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="Video URL" className="p-2 w-full text-black"/>
        <button type="submit" className="px-4 py-2 bg-red-600 rounded">Add Episode</button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {episodes.map(ep => (
          <div key={ep.id} className="bg-gray-800 p-4 rounded">
            <h3 className="text-lg font-bold">E{ep.episode_number} - {ep.title}</h3>
            <p>Season ID: {ep.season_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------- Main Admin Panel ----------------
const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"movies" | "tvshows" | "seasons" | "episodes">("movies");

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-red-500">Admin Panel</h1>

        {/* TAB SWITCHER */}
        <div className="flex space-x-4 mb-8">
          {["movies", "tvshows", "seasons", "episodes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded ${activeTab === tab ? "bg-red-600" : "bg-gray-700"}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* RENDER ACTIVE TAB */}
        {activeTab === "movies" && <MoviesManager />}
        {activeTab === "tvshows" && <TVShowsManager />}
        {activeTab === "seasons" && <SeasonsManager />}
        {activeTab === "episodes" && <EpisodesManager />}
      </div>
    </div>
  );
};

export default AdminPanel;
