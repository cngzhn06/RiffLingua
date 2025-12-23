import axios from 'axios';
import Constants from 'expo-constants';

// ============================================
// Genius API Konfigürasyonu
// ============================================

// Token app.config.js üzerinden .env dosyasından okunur
const GENIUS_ACCESS_TOKEN = Constants.expoConfig?.extra?.geniusAccessToken || '';
const GENIUS_API_BASE = 'https://api.genius.com';
const API_TIMEOUT = 20000; // 20 saniye

// ============================================
// Yardımcı Fonksiyonlar
// ============================================

/**
 * Sanatçı ve şarkı adını API için temizler
 */
function sanitizeInput(input: string): string {
  return input.trim().replace(/[^\w\s\-']/g, '');
}

/**
 * HTML etiketlerini temizler
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// ============================================
// Genius API Fonksiyonları
// ============================================

/**
 * Genius'ta şarkı arar
 */
async function searchGenius(query: string): Promise<any> {
  const response = await axios.get(`${GENIUS_API_BASE}/search`, {
    params: { q: query },
    headers: {
      Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
    },
    timeout: API_TIMEOUT,
  });

  return response.data.response.hits;
}

/**
 * Genius'tan şarkı detaylarını alır
 */
async function getSongDetails(songId: number): Promise<any> {
  const response = await axios.get(`${GENIUS_API_BASE}/songs/${songId}`, {
    headers: {
      Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
    },
    timeout: API_TIMEOUT,
  });

  return response.data.response.song;
}

/**
 * Genius sayfasından lyrics çeker (web scraping)
 */
async function scrapeLyrics(url: string): Promise<string> {
  const response = await axios.get(url, {
    timeout: API_TIMEOUT,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; RiffLingua/1.0)',
    },
  });

  const html = response.data;
  
  // Lyrics container'ı bul - Genius'un HTML yapısına göre
  const lyricsMatch = html.match(/<div[^>]*data-lyrics-container="true"[^>]*>([\s\S]*?)<\/div>/gi);
  
  if (lyricsMatch && lyricsMatch.length > 0) {
    let lyrics = lyricsMatch.join('\n');
    // HTML etiketlerini temizle
    lyrics = lyrics.replace(/<br\s*\/?>/gi, '\n');
    lyrics = stripHtml(lyrics);
    // Fazla boşlukları temizle
    lyrics = lyrics.replace(/\n{3,}/g, '\n\n').trim();
    return lyrics;
  }

  throw new Error('Lyrics container bulunamadı');
}

// ============================================
// Fallback API'ler
// ============================================

interface LyricsAPI {
  name: string;
  getUrl: (artist: string, title: string) => string;
  extractLyrics: (data: any) => string | undefined;
}

const FALLBACK_APIS: LyricsAPI[] = [
  {
    name: 'lyrics.ovh',
    getUrl: (artist, title) =>
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
    extractLyrics: (data) => data?.lyrics?.trim(),
  },
];

// ============================================
// Ana Fonksiyon
// ============================================

/**
 * Şarkı sözlerini çeker
 * 1. Önce Genius API'yi dener
 * 2. Başarısız olursa fallback API'leri dener
 */
export async function getLyrics(artist: string, title: string): Promise<string> {
  const cleanArtist = sanitizeInput(artist);
  const cleanTitle = sanitizeInput(title);
  const searchQuery = `${cleanArtist} ${cleanTitle}`;

  console.log(`🎵 Şarkı sözleri aranıyor: ${cleanTitle} - ${cleanArtist}`);

  // 1. Genius API'yi dene
  try {
    console.log('🔍 Genius API deneniyor...');
    
    const hits = await searchGenius(searchQuery);
    
    if (hits && hits.length > 0) {
      const song = hits[0].result;
      console.log(`✅ Genius'ta bulundu: ${song.full_title}`);
      
      // Lyrics URL'den sözleri çek
      const lyrics = await scrapeLyrics(song.url);
      console.log('✅ Şarkı sözleri başarıyla çekildi');
      return lyrics;
    }
  } catch (error: any) {
    console.log(`⚠️ Genius API başarısız: ${error.message}`);
  }

  // 2. Fallback API'leri dene
  let lastError: Error | null = null;

  for (const api of FALLBACK_APIS) {
    try {
      console.log(`🔍 ${api.name} deneniyor...`);

      const response = await axios.get(api.getUrl(cleanArtist, cleanTitle), {
        timeout: API_TIMEOUT,
        headers: { Accept: 'application/json' },
      });

      const lyrics = api.extractLyrics(response.data);

      if (lyrics) {
        console.log(`✅ ${api.name} başarılı`);
        return lyrics;
      }
    } catch (error: any) {
      console.log(`⚠️ ${api.name} başarısız: ${error.message}`);
      lastError = error;
    }
  }

  // Hata durumları
  if ((lastError as any)?.response?.status === 404) {
    throw new Error('Bu şarkının sözleri bulunamadı');
  }

  throw new Error(
    `Şarkı sözleri çekilemedi: ${lastError?.message || 'Tüm API kaynakları başarısız'}`
  );
}
