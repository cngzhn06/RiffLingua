import { Song } from '@/types/song';

export const todaysSong: Song = {
  id: 'adele-set-fire-to-the-rain',
  title: 'Set Fire to the Rain',
  artist: 'Adele',
  youtubeId: 'Ri7-vnrJD3k', // Official Music Video
  thumbnailUrl: 'https://img.youtube.com/vi/Ri7-vnrJD3k/maxresdefault.jpg',
  difficulty: 'Intermediate',
  duration: '4:02',
  genre: 'Pop / Soul',
  vocabularyWords: [
    {
      word: 'set fire',
      meaning: 'ateşe vermek, yakmak',
      example: 'I set fire to the rain',
      timestamp: '1:05'
    },
    {
      word: 'burn',
      meaning: 'yanmak, yakmak',
      example: 'Watched it burn as I touched your face',
      timestamp: '1:15'
    },
    {
      word: 'fall',
      meaning: 'düşmek, yıkılmak',
      example: 'When it fell, something died',
      timestamp: '1:25'
    },
    {
      word: 'reach',
      meaning: 'ulaşmak, erişmek',
      example: 'I was reaching for the sky',
      timestamp: '0:45'
    },
    {
      word: 'drown',
      meaning: 'boğulmak, batmak',
      example: 'Let it burn while I cried',
      timestamp: '2:00'
    }
  ],
  // lyrics alanı boş bırakılıyor - API'den dinamik olarak çekilecek
  lyrics: undefined,
  translation: undefined
};

// Daha fazla şarkı eklenebilir
export const songLibrary: Song[] = [todaysSong];
