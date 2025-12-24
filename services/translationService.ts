import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@/config';

// ============================================
// Cache Konfigürasyonu
// ============================================

const TRANSLATION_CACHE_PREFIX = 'translation_cache_';

// ============================================
// Yardımcı Fonksiyonlar
// ============================================

function getCacheKey(text: string, targetLang: string): string {
  const hash = text.slice(0, 50).replace(/\s+/g, '_').toLowerCase();
  return `${TRANSLATION_CACHE_PREFIX}${targetLang}_${hash}`;
}

/**
 * Metni parçalara böler (MyMemory 500 karakter limiti var)
 */
function splitText(text: string, maxLength: number = 450): string[] {
  const chunks: string[] = [];
  const lines = text.split('\n');
  let currentChunk = '';

  for (const line of lines) {
    if ((currentChunk + '\n' + line).length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = line;
    } else {
      currentChunk = currentChunk ? currentChunk + '\n' + line : line;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// ============================================
// Translation API Fonksiyonları
// ============================================

/**
 * Metni hedef dile çevirir (MyMemory API)
 */
async function translateChunk(
  text: string,
  targetLang: string = 'tr',
  sourceLang: string = 'en'
): Promise<string> {
  const { baseUrl } = API_CONFIG.translation;

  const response = await axios.get(`${baseUrl}/get`, {
    params: {
      q: text,
      langpair: `${sourceLang}|${targetLang}`,
    },
    timeout: API_CONFIG.timeout,
  });

  if (response.data.responseStatus === 200) {
    return response.data.responseData.translatedText;
  }

  throw new Error(response.data.responseDetails || 'Çeviri başarısız');
}

/**
 * Metni hedef dile çevirir
 */
export async function translateText(
  text: string,
  targetLang: string = 'tr',
  sourceLang: string = 'en'
): Promise<string> {
  if (!text || text.trim().length === 0) {
    return '';
  }

  // Translation API aktif mi kontrol et
  if (!API_CONFIG.translation.enabled) {
    throw new Error('Çeviri servisi devre dışı');
  }

  const cacheKey = getCacheKey(text, targetLang);

  // Önce cache'e bak
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      console.log('✅ Çeviri cache\'ten yüklendi');
      return cached;
    }
  } catch (error) {
    console.log('⚠️ Cache okuma hatası');
  }

  try {
    console.log('🌐 MyMemory API ile çeviri yapılıyor...');

    // Metni parçalara böl
    const chunks = splitText(text);
    const translatedChunks: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(`📝 Parça ${i + 1}/${chunks.length} çevriliyor...`);
      const translated = await translateChunk(chunks[i], targetLang, sourceLang);
      translatedChunks.push(translated);
      
      // Rate limiting için kısa bekleme
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    const fullTranslation = translatedChunks.join('\n\n');

    // Cache'e kaydet
    try {
      await AsyncStorage.setItem(cacheKey, fullTranslation);
      console.log('💾 Çeviri cache\'e kaydedildi');
    } catch (saveError) {
      console.log('⚠️ Cache kaydetme hatası');
    }

    console.log('✅ Çeviri tamamlandı');
    return fullTranslation;
  } catch (error: any) {
    console.error('Çeviri hatası:', error.message);
    throw new Error(`Çeviri yapılamadı: ${error.message}`);
  }
}

/**
 * Şarkı sözlerini çevirir
 */
export async function translateLyrics(
  lyrics: string,
  targetLang: string = 'tr'
): Promise<string> {
  if (!lyrics || lyrics.trim().length === 0) {
    return '';
  }

  console.log('🌐 Şarkı sözleri çevriliyor...');
  return translateText(lyrics, targetLang, 'en');
}

/**
 * Çeviri cache'ini temizler
 */
export async function clearTranslationCache(): Promise<void> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const translationKeys = allKeys.filter(key => key.startsWith(TRANSLATION_CACHE_PREFIX));
    await AsyncStorage.multiRemove(translationKeys);
    console.log(`🗑️ ${translationKeys.length} çeviri cache'ten silindi`);
  } catch (error) {
    console.error('Cache temizleme hatası:', error);
  }
}
