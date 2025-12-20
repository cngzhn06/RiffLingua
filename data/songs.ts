import { Song } from '@/types/song';

export const todaysSong: Song = {
  id: 'radiohead-exit-music',
  title: 'Exit Music (For a Film)',
  artist: 'Radiohead',
  youtubeId: 'Bf01riuiJWA', // Official Audio
  thumbnailUrl: 'https://img.youtube.com/vi/Bf01riuiJWA/maxresdefault.jpg',
  difficulty: 'Advanced',
  duration: '4:24',
  genre: 'Alternative Rock',
  vocabularyWords: [
    {
      word: 'wake',
      meaning: 'uyanmak, uyandırmak',
      example: 'Wake from your sleep',
      timestamp: '0:15'
    },
    {
      word: 'breathe',
      meaning: 'nefes almak',
      example: 'Breathe, keep breathing',
      timestamp: '1:30'
    },
    {
      word: 'fear',
      meaning: 'korku, korkmak',
      example: "Don't lose your nerve",
      timestamp: '2:00'
    },
    {
      word: 'hope',
      meaning: 'umut, umut etmek',
      example: 'We hope that you choke',
      timestamp: '3:15'
    },
    {
      word: 'escape',
      meaning: 'kaçmak, kaçış',
      example: 'We can escape together',
      timestamp: '2:45'
    }
  ],
  lyrics: `Wake from your sleep
The drying of your tears
Today we escape
We escape

Pack and get dressed
Before your father hears us
Before all hell breaks loose

Breathe, keep breathing
Don't lose your nerve
Breathe, keep breathing
I can't do this alone

Sing us a song
A song to keep us warm
There's such a chill
Such a chill

And you can laugh
A spineless laugh
We hope your rules and wisdom choke you
Now we are one
In everlasting peace

We hope that you choke
That you choke
We hope that you choke
That you choke
We hope that you choke`,
  translation: `Uykudan uyan
Gözyaşlarının kuruması
Bugün kaçıyoruz
Kaçıyoruz

Toplan ve giyin
Baban bizi duymadan önce
Cehennem koparmadan önce

Nefes al, nefes almaya devam et
Cesaretini kaybetme
Nefes al, nefes almaya devam et
Bunu tek başıma yapamam

Bize bir şarkı söyle
Bizi ısıtacak bir şarkı
Öyle bir soğukluk var
Öyle bir soğukluk

Ve gülülebilirsin
Omurgasız bir gülüş
Umarız kuralların ve bilgeliğin seni boğar
Şimdi biriz
Sonsuz barış içinde

Umarız boğulursun
Boğulursun
Umarız boğulursun
Boğulursun
Umarız boğulursun`
};

// Daha fazla şarkı eklenebilir
export const songLibrary: Song[] = [todaysSong];

