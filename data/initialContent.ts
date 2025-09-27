import { Movie } from '../types';

const placeholderVideoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const placeholderVideoUrl2 = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
const placeholderVideoUrl3 = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'


export const initialContent: Movie[] = [
  {
    id: 1,
    type: 'movie',
    title: 'Echoes of the Void',
    description: 'A lone astronaut discovers a mysterious signal from a supposedly dead planet, forcing her to confront her past and the future of humanity.',
    backdropPath: 'https://picsum.photos/seed/1/1280/720',
    posterPath: 'https://picsum.photos/seed/1/500/750',
    videoSources: [
        { quality: '1080p', url: placeholderVideoUrl },
        { quality: '720p', url: placeholderVideoUrl2 },
    ],
    genres: ['Sci-Fi', 'Thriller'],
    rating: 8.5,
    releaseYear: 2024,
  },
  {
    id: 2,
    type: 'movie',
    title: 'The Crimson Cipher',
    description: 'A brilliant historian races against a secret society to uncover a hidden treasure that could rewrite history, all while being framed for a crime she didn\'t commit.',
    backdropPath: 'https://picsum.photos/seed/2/1280/720',
    posterPath: 'https://picsum.photos/seed/2/500/750',
    videoSources: [
        { quality: '1080p', url: placeholderVideoUrl3 },
        { quality: '720p', url: placeholderVideoUrl },
    ],
    genres: ['Action', 'Adventure'],
    rating: 7.9,
    releaseYear: 2023,
  },
  {
    id: 3,
    type: 'movie',
    title: 'Whispers in the Mist',
    description: 'In a secluded village shrouded in perpetual fog, a detective investigates a series of disappearances that the locals attribute to an ancient legend.',
    backdropPath: 'https://picsum.photos/seed/3/1280/720',
    posterPath: 'https://picsum.photos/seed/3/500/750',
    videoSources: [
        { quality: '720p', url: placeholderVideoUrl },
    ],
    genres: ['Horror', 'Mystery'],
    rating: 8.2,
    releaseYear: 2022,
  },
  {
    id: 4,
    type: 'movie',
    title: 'The Last Stand-Up',
    description: 'An aging comedian, on the verge of retiring, gets one last shot at fame but must decide if the price of success is worth losing his integrity.',
    backdropPath: 'https://picsum.photos/seed/4/1280/720',
    posterPath: 'https://picsum.photos/seed/4/500/750',
    videoSources: [
        { quality: '1080p', url: placeholderVideoUrl },
        { quality: '720p', url: placeholderVideoUrl2 },
    ],
    genres: ['Comedy', 'Drama'],
    rating: 7.5,
    releaseYear: 2024,
  },
  {
    id: 5,
    type: 'movie',
    title: 'Galactic Drift',
    description: 'Two smugglers in a far-off galaxy bite off more than they can chew when their latest cargo turns out to be a key to an intergalactic war.',
    backdropPath: 'https://picsum.photos/seed/5/1280/720',
    posterPath: 'https://picsum.photos/seed/5/500/750',
    videoSources: [
        { quality: '1080p', url: placeholderVideoUrl },
        { quality: '480p', url: placeholderVideoUrl3 },
    ],
    genres: ['Sci-Fi', 'Action'],
    rating: 8.8,
    releaseYear: 2021,
  },
  {
    id: 6,
    type: 'movie',
    title: 'Cobblestone Hearts',
    description: 'A young artist in 1920s Paris finds unexpected love with a pragmatic baker, but their different worlds threaten to pull them apart.',
    backdropPath: 'https://picsum.photos/seed/6/1280/720',
    posterPath: 'https://picsum.photos/seed/6/500/750',
    videoSources: [
        { quality: '720p', url: placeholderVideoUrl },
    ],
    genres: ['Romance', 'Drama'],
    rating: 8.1,
    releaseYear: 2020,
  },
    {
    id: 7,
    type: 'movie',
    title: 'Zero Protocol',
    description: 'A rogue AI has taken control of the world\'s defense systems. Only a disgraced hacker has the key to stopping it, but she must evade government agents who believe she is the culprit.',
    backdropPath: 'https://picsum.photos/seed/7/1280/720',
    posterPath: 'https://picsum.photos/seed/7/500/750',
    videoSources: [
        { quality: '1080p', url: placeholderVideoUrl2 },
        { quality: '720p', url: placeholderVideoUrl },
    ],
    genres: ['Thriller', 'Action', 'Sci-Fi'],
    rating: 8.0,
    releaseYear: 2023,
  },
  {
    id: 8,
    type: 'movie',
    title: 'The Jester\'s Gambit',
    description: 'In a kingdom on the brink of collapse, a court jester with a sharp wit and a hidden agenda becomes the unlikely mastermind behind a rebellion.',
    backdropPath: 'https://picsum.photos/seed/8/1280/720',
    posterPath: 'https://picsum.photos/seed/8/500/750',
    videoSources: [
        { quality: '1080p', url: placeholderVideoUrl },
    ],
    genres: ['Adventure', 'Fantasy'],
    rating: 8.4,
    releaseYear: 2022,
  }
];