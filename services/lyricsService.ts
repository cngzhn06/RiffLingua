import axios from 'axios';

const LYRICS_APIS = [
  {
    name: 'lyrics.ovh',
    getUrl: (artist: string, title: string) => 
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
    extractLyrics: (data: any) => data?.lyrics?.trim()
  },
  {
    name: 'lyricsgenius-proxy',
    getUrl: (artist: string, title: string) => 
      `https://some-random-api.com/lyrics?title=${encodeURIComponent(`${artist} ${title}`)}`,
    extractLyrics: (data: any) => data?.lyrics?.trim()
  }
];

/**
 * Şarkı sözlerini çeker - birden fazla API kaynağını dener
 */
export async function getLyrics(artist: string, title: string): Promise<string> {
  // Sanatçı ve başlığı temizle
  const cleanArtist = artist.trim().replace(/[^\w\s-']/g, '');
  const cleanTitle = title.trim().replace(/[^\w\s-'()]/g, '');
  
  let lastError: Error | null = null;
  
  // Her API'yi sırayla dene
  for (const api of LYRICS_APIS) {
    try {
      console.log(`🎵 ${api.name} API deneniyor: ${cleanTitle} - ${cleanArtist}`);
      
      const response = await axios.get(
        api.getUrl(cleanArtist, cleanTitle),
        {
          timeout: 15000, // 15 saniye timeout
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      const lyrics = api.extractLyrics(response.data);
      
      if (lyrics) {
        console.log(`✅ ${api.name} API'den sözler bulundu`);
        return lyrics;
      }
    } catch (error: any) {
      console.log(`⚠️ ${api.name} API başarısız:`, error.message);
      lastError = error;
      // Sonraki API'yi dene
      continue;
    }
  }
  
  // Hiçbir API çalışmadıysa hata fırlat
  if (lastError?.response?.status === 404) {
    throw new Error('Bu şarkının sözleri bulunamadı');
  }
  
  throw new Error(`Şarkı sözleri çekilemedi: ${lastError?.message || 'Tüm API kaynakları başarısız oldu'}`);
}

/**
 * Şarkı sözlerini getirir (sadece Lyrics.ovh kullanır)
 */
export async function fetchSongWithLyrics(title: string, artist: string) {
  try {
    console.log(`🎵 Şarkı sözleri aranıyor: ${title} - ${artist}`);
    
    // Lyrics.ovh'den sözleri al
    const lyrics = await getLyrics(artist, title);
    console.log('✅ Şarkı sözleri bulundu');
    
    return {
      title,
      artist,
      lyrics
    };
  } catch (error: any) {
    console.error('Şarkı sözleri alınamadı:', error);
    throw error;
  }
}

