import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AdminPanel: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [tvShows, setTvShows] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);

  // Form States
  const [movie, setMovie] = useState({ title: "", description: "", poster_url: "", backdrop_url: "", video_url: "" });
  const [tvShow, setTvShow] = useState({ title: "", description: "", poster_url: "", backdrop_url: "" });
  const [season, setSeason] = useState({ tv_show_id: "", season_number: 1, title: "" });
  const [episode, setEpisode] = useState({ season_id: "", episode_number: 1, title: "", video_url: "" });

  // Load Data
  async function loadData() {
    const { data: moviesData } = await supabase.from("movies").select("*").order("created_at", { ascending: false });
    const { data: showsData } = await supabase.from("tv_shows").select("*").order("created_at", { ascending: false });
    const { data: seasonData } = await supabase.from("seasons").select("*").order("created_at", { ascending: false });
    const { data: episodeData } = await supabase.from("episodes").select("*").order("created_at", { ascending: false });

    setMovies(moviesData || []);
    setTvShows(showsData || []);
    setSeasons(seasonData || []);
    setEpisodes(episodeData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Add Movie
  async function addMovie() {
    await supabase.from("movies").insert([movie]);
    setMovie({ title: "", description: "", poster_url: "", backdrop_url: "", video_url: "" });
    loadData();
  }

  // Add TV Show
  async function addTvShow() {
    await supabase.from("tv_shows").insert([tvShow]);
    setTvShow({ title: "", description: "", poster_url: "", backdrop_url: "" });
    loadData();
  }

  // Add Season
  async function addSeason() {
    await supabase.from("seasons").insert([season]);
    setSeason({ tv_show_id: "", season_number: 1, title: "" });
    loadData();
  }

  // Add Episode
  async function addEpisode() {
    await supabase.from("episodes").insert([episode]);
    setEpisode({ season_id: "", episode_number: 1, title: "", video_url: "" });
    loadData();
  }

  return (
    <div className="p-6 space-y-12">
      {/* MOVIES */}
      <div>
        <h2 className="text-2xl font-bold mb-4">🎬 Movies</h2>
        <input placeholder="Title" value={movie.title} onChange={(e) => setMovie({ ...movie, title: e.target.value })} />
        <input placeholder="Description" value={movie.description} onChange={(e) => setMovie({ ...movie, description: e.target.value })} />
        <input placeholder="Poster URL" value={movie.poster_url} onChange={(e) => setMovie({ ...movie, poster_url: e.target.value })} />
        <input placeholder="Backdrop URL" value={movie.backdrop_url} onChange={(e) => setMovie({ ...movie, backdrop_url: e.target.value })} />
        <input placeholder="Video URL" value={movie.video_url} onChange={(e) => setMovie({ ...movie, video_url: e.target.value })} />
        <button onClick={addMovie}>Add Movie</button>

        <ul>
          {movies.map((m) => (
            <li key={m.id}>{m.title}</li>
          ))}
        </ul>
      </div>

      {/* TV SHOWS */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📺 TV Shows</h2>
        <input placeholder="Title" value={tvShow.title} onChange={(e) => setTvShow({ ...tvShow, title: e.target.value })} />
        <input placeholder="Description" value={tvShow.description} onChange={(e) => setTvShow({ ...tvShow, description: e.target.value })} />
        <input placeholder="Poster URL" value={tvShow.poster_url} onChange={(e) => setTvShow({ ...tvShow, poster_url: e.target.value })} />
        <input placeholder="Backdrop URL" value={tvShow.backdrop_url} onChange={(e) => setTvShow({ ...tvShow, backdrop_url: e.target.value })} />
        <button onClick={addTvShow}>Add TV Show</button>

        <ul>
          {tvShows.map((s) => (
            <li key={s.id}>{s.title}</li>
          ))}
        </ul>
      </div>

      {/* SEASONS */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📂 Seasons</h2>
        <select value={season.tv_show_id} onChange={(e) => setSeason({ ...season, tv_show_id: e.target.value })}>
          <option value="">Select TV Show</option>
          {tvShows.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
        <input type="number" placeholder="Season Number" value={season.season_number} onChange={(e) => setSeason({ ...season, season_number: Number(e.target.value) })} />
        <input placeholder="Season Title" value={season.title} onChange={(e) => setSeason({ ...season, title: e.target.value })} />
        <button onClick={addSeason}>Add Season</button>

        <ul>
          {seasons.map((s) => (
            <li key={s.id}>S{s.season_number}: {s.title}</li>
          ))}
        </ul>
      </div>

      {/* EPISODES */}
      <div>
        <h2 className="text-2xl font-bold mb-4">🎞 Episodes</h2>
        <select value={episode.season_id} onChange={(e) => setEpisode({ ...episode, season_id: e.target.value })}>
          <option value="">Select Season</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>S{s.season_number} - {s.title}</option>
          ))}
        </select>
        <input type="number" placeholder="Episode Number" value={episode.episode_number} onChange={(e) => setEpisode({ ...episode, episode_number: Number(e.target.value) })} />
        <input placeholder="Episode Title" value={episode.title} onChange={(e) => setEpisode({ ...episode, title: e.target.value })} />
        <input placeholder="Video URL" value={episode.video_url} onChange={(e) => setEpisode({ ...episode, video_url: e.target.value })} />
        <button onClick={addEpisode}>Add Episode</button>

        <ul>
          {episodes.map((ep) => (
            <li key={ep.id}>Ep{ep.episode_number}: {ep.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
