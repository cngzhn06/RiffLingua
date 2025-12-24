import axios from 'axios';
import { API_CONFIG } from '@/config';

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

/**
 * HTML entities decode eder (&#x27; -> ', &amp; -> &, vb.)
 */
function decodeHtmlEntities(text: string): string {
  let decoded = text;
  
  // Named entities
  decoded = decoded.replace(/&amp;/gi, '&');
  decoded = decoded.replace(/&lt;/gi, '<');
  decoded = decoded.replace(/&gt;/gi, '>');
  decoded = decoded.replace(/&quot;/gi, '"');
  decoded = decoded.replace(/&#39;/gi, "'");
  decoded = decoded.replace(/&#x27;/gi, "'");
  decoded = decoded.replace(/&apos;/gi, "'");
  decoded = decoded.replace(/&#x2F;/gi, '/');
  decoded = decoded.replace(/&#x60;/gi, '`');
  decoded = decoded.replace(/&#x3D;/gi, '=');
  decoded = decoded.replace(/&nbsp;/gi, ' ');
  decoded = decoded.replace(/&ndash;/gi, '-');
  decoded = decoded.replace(/&mdash;/gi, '-');
  decoded = decoded.replace(/&lsquo;/gi, "'");
  decoded = decoded.replace(/&rsquo;/gi, "'");
  decoded = decoded.replace(/&ldquo;/gi, '"');
  decoded = decoded.replace(/&rdquo;/gi, '"');
  decoded = decoded.replace(/&hellip;/gi, '...');
  
  // Numeric entities (&#123; or &#x1F;)
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  return decoded;
}

/**
 * Genius'tan gelen lyrics'i temizler
 * - İlk satırı siler (contributor bilgisi)
 * - [Chorus], [Verse], [Bridge] gibi bölüm etiketlerini kaldırır
 */
function cleanLyrics(lyrics: string): string {
  let cleaned = lyrics;
  
  // Satırlara böl
  const lines = cleaned.split('\n');
  
  // İlk satırı kontrol et - "Contributors" veya rakamla başlıyorsa sil
  if (lines.length > 0) {
    const firstLine = lines[0].toLowerCase();
    if (
      firstLine.includes('contributor') ||
      firstLine.includes('translation') ||
      /^\d+\s*contributor/i.test(lines[0]) ||
      /^\d+\s*translation/i.test(lines[0])
    ) {
      lines.shift();
    }
  }
  
  cleaned = lines.join('\n');
  
  // Köşeli parantez içindeki bölüm etiketlerini kaldır
  // [Chorus], [Verse 1], [Bridge], [Intro], [Outro], [Pre-Chorus], vb.
  cleaned = cleaned.replace(/\[.*?\]/g, '');
  
  // Fazla boş satırları temizle
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
  
  return cleaned;
}

// ============================================
// Genius API Fonksiyonları
// ============================================

/**
 * Genius'ta şarkı arar
 */
async function searchGenius(query: string): Promise<any> {
  const { baseUrl, accessToken } = API_CONFIG.genius;
  
  const response = await axios.get(`${baseUrl}/search`, {
    params: { q: query },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: API_CONFIG.timeout,
  });

  return response.data.response.hits;
}

/**
 * Genius sayfasından lyrics çeker (web scraping)
 */
async function scrapeLyrics(url: string): Promise<string> {
  const response = await axios.get(url, {
    timeout: API_CONFIG.timeout,
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
    // HTML entities decode et
    lyrics = decodeHtmlEntities(lyrics);
    // Genius'a özel temizlik (contributor, [Chorus] vb.)
    lyrics = cleanLyrics(lyrics);
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
 * 1. Önce Genius API'yi dener (API key varsa)
 * 2. Başarısız olursa fallback API'leri dener
 */
export async function getLyrics(artist: string, title: string): Promise<string> {
  const cleanArtist = sanitizeInput(artist);
  const cleanTitle = sanitizeInput(title);
  const searchQuery = `${cleanArtist} ${cleanTitle}`;

  console.log(`🎵 Şarkı sözleri aranıyor: ${cleanTitle} - ${cleanArtist}`);

  // 1. Genius API'yi dene (API key varsa)
  if (API_CONFIG.genius.enabled) {
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
  } else {
    console.log('⚠️ Genius API key bulunamadı, fallback kullanılıyor');
  }

  // 2. Fallback API'leri dene
  let lastError: Error | null = null;

  for (const api of FALLBACK_APIS) {
    try {
      console.log(`🔍 ${api.name} deneniyor...`);

      const response = await axios.get(api.getUrl(cleanArtist, cleanTitle), {
        timeout: API_CONFIG.timeout,
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
