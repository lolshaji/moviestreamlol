export interface Movie {
  type: 'movie';
  id: number;
  title: string;
  description: string;
  backdropPath: string;
  posterPath: string;
  videoSources: { quality: string; url: string }[];
  subtitleUrl?: string;
  genres: string[];
  rating: number;
  releaseYear: number;
}

export interface Episode {
  id: number;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnailPath: string;
  videoSources: { quality: string; url: string }[];
  subtitleUrl?: string;
  duration: number; // in minutes
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface TVShow {
  type: 'tv';
  id: number;
  title: string;
  description: string;
  backdropPath: string;
  posterPath: string;
  genres: string[];
  rating: number;
  releaseYear: number;
  seasons: Season[];
}

export type Content = Movie | TVShow;

export type DownloadedContent = {
  content: Content | (Episode & { showTitle: string });
  blobUrl: string;
};