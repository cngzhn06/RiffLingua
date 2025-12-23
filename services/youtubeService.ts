import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// YouTube API Konfigürasyonu
// ============================================

const YOUTUBE_API_KEY = Constants.expoConfig?.extra?.youtubeApiKey || '';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_TIMEOUT = 15000;

// Cache key prefix
const YOUTUBE_CACHE_PREFIX = 'youtube_cache_';

// ============================================
// Yardımcı Fonksiyonlar
// ============================================

function getCacheKey(artist: string, title: string): string {
  const key = `${artist}_${title}`.toLowerCase().replace(/\s+/g, '_');
  return `${YOUTUBE_CACHE_PREFIX}${key}`;
}

// ============================================
// YouTube API Fonksiyonları
// ============================================

export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

/**
 * YouTube'da şarkı videosu arar
 */
export async function searchYouTubeVideo(artist: string, title: string): Promise<YouTubeVideo | null> {
  const cacheKey = getCacheKey(artist, title);

  // Önce cache'e bak
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      console.log('✅ YouTube video cache\'ten yüklendi');
      return JSON.parse(cached);
    }
  } catch (error) {
    console.log('⚠️ YouTube cache okuma hatası');
  }

  // API key kontrolü
  if (!YOUTUBE_API_KEY) {
    console.log('⚠️ YouTube API key bulunamadı');
    return null;
  }

  try {
    const searchQuery = `${artist} ${title} official`;
    console.log(`🎬 YouTube\'da aranıyor: ${searchQuery}`);

    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        videoCategoryId: '10', // Music category
        maxResults: 1,
        key: YOUTUBE_API_KEY,
      },
      timeout: API_TIMEOUT,
    });

    const items = response.data.items;

    if (items && items.length > 0) {
      const video = items[0];
      const result: YouTubeVideo = {
        videoId: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
        channelTitle: video.snippet.channelTitle,
      };

      // Cache'e kaydet
      try {
        await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
        console.log('💾 YouTube video cache\'e kaydedildi');
      } catch (saveError) {
        console.log('⚠️ YouTube cache kaydetme hatası');
      }

      console.log(`✅ YouTube video bulundu: ${result.title}`);
      return result;
    }

    console.log('⚠️ YouTube video bulunamadı');
    return null;
  } catch (error: any) {
    console.error('YouTube API hatası:', error.message);
    return null;
  }
}

/**
 * YouTube cache'ini temizler
 */
export async function clearYouTubeCache(): Promise<void> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const youtubeKeys = allKeys.filter(key => key.startsWith(YOUTUBE_CACHE_PREFIX));
    await AsyncStorage.multiRemove(youtubeKeys);
    console.log(`🗑️ ${youtubeKeys.length} YouTube video cache'ten silindi`);
  } catch (error) {
    console.error('YouTube cache temizleme hatası:', error);
  }
}

