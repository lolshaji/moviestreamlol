import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  backdrop_url: string;
  video_url: string;
}

interface TVShow {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  backdrop_url: string;
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [hero, setHero] = useState<Movie | null>(null);

  // Load Movies
  async function loadMovies() {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setMovies(data as Movie[]);
      if (data.length > 0) setHero(data[0] as Movie); // latest movie is hero
    }
  }

  // Load TV Shows
  async function loadTvShows() {
    const { data, error } = await supabase
      .from("tv_shows")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setTvShows(data as TVShow[]);
  }

  useEffect(() => {
    loadMovies();
    loadTvShows();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* HERO SECTION */}
      {hero && (
        <div
          className="relative h-[70vh] flex flex-col justify-end p-8"
          style={{
            backgroundImage: `url(${hero.backdrop_url || hero.poster_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">{hero.title}</h1>
            <p className="mb-4">{hero.description}</p>
            <a
              href={hero.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-red-600 text-lg font-semibold rounded"
            >
              ▶ Play
            </a>
          </div>
        </div>
      )}

      {/* MOVIES SECTION */}
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-4">🎬 Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {movies.map((m) => (
            <div
              key={m.id}
              className="bg-gray-800 rounded overflow-hidden hover:scale-105 transition"
            >
              <img
                src={m.poster_url}
                alt={m.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-2">
                <h3 className="text-sm font-bold">{m.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TV SHOWS SECTION */}
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-4">📺 TV Shows</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {tvShows.map((s) => (
            <div
              key={s.id}
              className="bg-gray-800 rounded overflow-hidden hover:scale-105 transition"
            >
              <img
                src={s.poster_url}
                alt={s.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-2">
                <h3 className="text-sm font-bold">{s.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

