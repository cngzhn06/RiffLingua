import Constants from 'expo-constants';

// ============================================
// API Konfigürasyonu
// ============================================
// Tüm API anahtarları ve URL'ler bu dosyadan yönetilir
// .env dosyasından app.config.js üzerinden okunur

interface ApiConfig {
  // YouTube Data API v3
  youtube: {
    apiKey: string;
    baseUrl: string;
    enabled: boolean;
  };
  
  // Genius Lyrics API
  genius: {
    accessToken: string;
    baseUrl: string;
    enabled: boolean;
  };
  
  // MyMemory Translation API (ücretsiz, API key gerektirmez)
  translation: {
    baseUrl: string;
    enabled: boolean;
  };
  
  // Genel ayarlar
  timeout: number;
}

// Extra config'den değerleri al
const extra = Constants.expoConfig?.extra || {};

export const API_CONFIG: ApiConfig = {
  youtube: {
    apiKey: extra.youtubeApiKey || '',
    baseUrl: 'https://www.googleapis.com/youtube/v3',
    enabled: !!extra.youtubeApiKey,
  },
  
  genius: {
    accessToken: extra.geniusAccessToken || '',
    baseUrl: 'https://api.genius.com',
    enabled: !!extra.geniusAccessToken,
  },
  
  translation: {
    baseUrl: 'https://api.mymemory.translated.net',
    enabled: true, // API key gerektirmez
  },
  
  timeout: 20000, // 20 saniye
};

// ============================================
// Yardımcı Fonksiyonlar
// ============================================

/**
 * API durumunu loglar (debug için)
 */
export function logApiStatus(): void {
  console.log('📡 API Durumu:');
  console.log(`  YouTube: ${API_CONFIG.youtube.enabled ? '✅ Aktif' : '❌ API key yok'}`);
  console.log(`  Genius: ${API_CONFIG.genius.enabled ? '✅ Aktif' : '❌ API key yok'}`);
  console.log(`  Translation: ${API_CONFIG.translation.enabled ? '✅ Aktif' : '❌ Devre dışı'}`);
}

/**
 * Belirli bir API'nin aktif olup olmadığını kontrol eder
 */
export function isApiEnabled(api: 'youtube' | 'genius' | 'translation'): boolean {
  return API_CONFIG[api].enabled;
}

