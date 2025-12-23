import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLyrics } from '@/services/lyricsService';

// Cache key prefix
const LYRICS_CACHE_PREFIX = 'lyrics_cache_';

interface UseLyricsOptions {
  artist: string;
  title: string;
  initialLyrics?: string;
}

interface UseLyricsReturn {
  lyrics: string | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Cache key oluşturur
 */
function getCacheKey(artist: string, title: string): string {
  const key = `${artist}_${title}`.toLowerCase().replace(/\s+/g, '_');
  return `${LYRICS_CACHE_PREFIX}${key}`;
}

/**
 * Şarkı sözlerini yöneten custom hook
 * - Cache'te varsa oradan okur
 * - Statik lyrics varsa API'ye gitmez
 * - API'den çekilen lyrics'i cache'e kaydeder
 */
export function useLyrics({ artist, title, initialLyrics }: UseLyricsOptions): UseLyricsReturn {
  const [lyrics, setLyrics] = useState<string | undefined>(initialLyrics);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLyrics = useCallback(async (forceRefresh = false) => {
    // Artist veya title boşsa çalışma
    if (!artist || !title) {
      return;
    }

    // Statik lyrics varsa API'ye gitme
    if (initialLyrics) {
      console.log('✅ Statik şarkı sözleri kullanılıyor');
      setLyrics(initialLyrics);
      return;
    }

    const cacheKey = getCacheKey(artist, title);

    // Force refresh değilse önce cache'e bak
    if (!forceRefresh) {
      try {
        const cachedLyrics = await AsyncStorage.getItem(cacheKey);
        if (cachedLyrics) {
          console.log('✅ Cache\'ten şarkı sözleri yüklendi');
          setLyrics(cachedLyrics);
          return;
        }
      } catch (cacheError) {
        console.log('⚠️ Cache okuma hatası:', cacheError);
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`🎵 Şarkı sözleri çekiliyor: ${title} - ${artist}`);
      const fetchedLyrics = await getLyrics(artist, title);
      
      // Cache'e kaydet
      try {
        await AsyncStorage.setItem(cacheKey, fetchedLyrics);
        console.log('💾 Şarkı sözleri cache\'e kaydedildi');
      } catch (saveError) {
        console.log('⚠️ Cache kaydetme hatası:', saveError);
      }

      setLyrics(fetchedLyrics);
      console.log('✅ Şarkı sözleri başarıyla yüklendi');
    } catch (err: any) {
      console.error('Şarkı sözleri çekilemedi:', err);
      setError(err.message || 'Şarkı sözleri yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }, [artist, title, initialLyrics]);

  useEffect(() => {
    fetchLyrics();
  }, [fetchLyrics]);

  return {
    lyrics,
    isLoading,
    error,
    refetch: () => fetchLyrics(true), // Force refresh
  };
}

/**
 * Tüm lyrics cache'ini temizler
 */
export async function clearLyricsCache(): Promise<void> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const lyricsKeys = allKeys.filter(key => key.startsWith(LYRICS_CACHE_PREFIX));
    await AsyncStorage.multiRemove(lyricsKeys);
    console.log(`🗑️ ${lyricsKeys.length} şarkı sözü cache'ten silindi`);
  } catch (error) {
    console.error('Cache temizleme hatası:', error);
  }
}
