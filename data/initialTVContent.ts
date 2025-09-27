import { TVShow } from '../types';

const placeholderVideoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const placeholderVideoUrl2 = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'

export const initialTVContent: TVShow[] = [
  {
    id: 101,
    type: 'tv',
    title: 'The Quantum Paradox',
    description: 'A team of physicists accidentally opens a portal to parallel universes and must navigate the consequences, both personal and world-altering, while trying to find their way home.',
    backdropPath: 'https://picsum.photos/seed/101/1280/720',
    posterPath: 'https://picsum.photos/seed/101/500/750',
    genres: ['Sci-Fi', 'Drama', 'Thriller'],
    rating: 9.2,
    releaseYear: 2023,
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            id: 10101,
            episodeNumber: 1,
            title: 'The Breach',
            description: 'A high-energy experiment goes unexpectedly right, and then terribly wrong, opening the first rift between worlds.',
            thumbnailPath: 'https://picsum.photos/seed/10101/400/225',
            videoSources: [{ quality: '1080p', url: placeholderVideoUrl }, { quality: '720p', url: placeholderVideoUrl2 }],
            duration: 52,
          },
          {
            id: 10102,
            episodeNumber: 2,
            title: 'Echoes',
            description: 'The team makes first contact with a slightly different version of themselves, leading to a crisis of identity.',
            thumbnailPath: 'https://picsum.photos/seed/10102/400/225',
            videoSources: [{ quality: '1080p', url: placeholderVideoUrl }],
            duration: 48,
          },
        ],
      },
      {
        seasonNumber: 2,
        episodes: [
          {
            id: 10103,
            episodeNumber: 1,
            title: 'The Other Side',
            description: 'Trapped in a technologically advanced but authoritarian parallel Earth, the team must blend in to survive.',
            thumbnailPath: 'https://picsum.photos/seed/10103/400/225',
            videoSources: [{ quality: '1080p', url: placeholderVideoUrl2 }],
            duration: 55,
          },
        ],
      },
    ],
  },
  {
    id: 102,
    type: 'tv',
    title: 'Crown of Shadows',
    description: 'In the mythical land of Aerthos, five kingdoms vie for control of the Obsidian Throne, unaware that a dormant evil is stirring in the frozen north.',
    backdropPath: 'https://picsum.photos/seed/102/1280/720',
    posterPath: 'https://picsum.photos/seed/102/500/750',
    genres: ['Fantasy', 'Action', 'Adventure'],
    rating: 8.9,
    releaseYear: 2022,
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            id: 10201,
            episodeNumber: 1,
            title: 'The Whispering Woods',
            description: 'An ancient prophecy is rediscovered, setting a young princess on a dangerous path.',
            thumbnailPath: 'https://picsum.photos/seed/10201/400/225',
            videoSources: [{ quality: '720p', url: placeholderVideoUrl }],
            duration: 61,
          },
          {
            id: 10202,
            episodeNumber: 2,
            title: 'A Pact of Steel',
            description: 'Alliances are forged in the face of a common, monstrous threat from the borderlands.',
            thumbnailPath: 'https://picsum.photos/seed/10202/400/225',
            videoSources: [{ quality: '720p', url: placeholderVideoUrl2 }],
            duration: 58,
          },
        ],
      },
    ],
  },
];