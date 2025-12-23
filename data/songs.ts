import { Song } from '@/types/song';

export const todaysSong: Song = {
  id: 'radiohead-creep',
  title: 'Creep',
  artist: 'Radiohead',
  youtubeId: 'XFkzRNyygfk', // Official Video
  thumbnailUrl: 'https://img.youtube.com/vi/XFkzRNyygfk/maxresdefault.jpg',
  difficulty: 'Intermediate',
  duration: '3:56',
  genre: 'Alternative Rock',
  vocabularyWords: [
    {
      word: 'creep',
      meaning: 'sürüngen, tuhaf biri',
      example: "I'm a creep",
      timestamp: '1:05'
    },
    {
      word: 'weirdo',
      meaning: 'garip, acayip biri',
      example: "I'm a weirdo",
      timestamp: '1:08'
    },
    {
      word: 'belong',
      meaning: 'ait olmak',
      example: "I don't belong here",
      timestamp: '1:15'
    },
    {
      word: 'notice',
      meaning: 'fark etmek',
      example: "You'd notice",
      timestamp: '0:30'
    },
    {
      word: 'perfect',
      meaning: 'mükemmel',
      example: "You're so very special",
      timestamp: '2:00'
    }
  ],
  // Lyrics API'den çekilecek - boş bırak
  lyrics: undefined,
  translation: undefined
};

export const songLibrary: Song[] = [todaysSong];