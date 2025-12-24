import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// Sabit Değerler
// ============================================

const DAILY_LIMIT_KEY = 'song_daily_limit';
const SAVED_SONGS_KEY = 'saved_songs';
const DAILY_SEARCH_LIMIT = 2;

// ============================================
// Tipler
// ============================================

export interface SavedSong {
  id: string;
  artist: string;
  title: string;
  lyrics: string;
  videoId?: string;
  channelTitle?: string;
  savedAt: string;
}

interface DailyLimitData {
  date: string;
  count: number;
}

// ============================================
// Günlük Limit Fonksiyonları
// ============================================

/**
 * Bugünün tarihini YYYY-MM-DD formatında döndürür
 */
function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Günlük limit verilerini getirir
 */
async function getDailyLimitData(): Promise<DailyLimitData> {
  try {
    const data = await AsyncStorage.getItem(DAILY_LIMIT_KEY);
    if (data) {
      const parsed = JSON.parse(data) as DailyLimitData;
      // Tarih bugün değilse sıfırla
      if (parsed.date !== getTodayDate()) {
        return { date: getTodayDate(), count: 0 };
      }
      return parsed;
    }
  } catch (error) {
    console.error('Limit verisi okuma hatası:', error);
  }
  return { date: getTodayDate(), count: 0 };
}

/**
 * Günlük limit verilerini kaydeder
 */
async function saveDailyLimitData(data: DailyLimitData): Promise<void> {
  try {
    await AsyncStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Limit verisi kaydetme hatası:', error);
  }
}

/**
 * Günlük kalan arama hakkını döndürür
 */
export async function getRemainingSearches(): Promise<number> {
  const data = await getDailyLimitData();
  return Math.max(0, DAILY_SEARCH_LIMIT - data.count);
}

/**
 * Arama hakkı olup olmadığını kontrol eder
 */
export async function canSearch(): Promise<boolean> {
  const remaining = await getRemainingSearches();
  return remaining > 0;
}

/**
 * Arama hakkını bir düşürür
 */
export async function useSearchCredit(): Promise<boolean> {
  const data = await getDailyLimitData();
  
  if (data.count >= DAILY_SEARCH_LIMIT) {
    return false;
  }
  
  data.count += 1;
  await saveDailyLimitData(data);
  console.log(`🔢 Arama hakkı kullanıldı. Kalan: ${DAILY_SEARCH_LIMIT - data.count}`);
  return true;
}

/**
 * Günlük limiti sıfırlar (test için)
 */
export async function resetDailyLimit(): Promise<void> {
  await saveDailyLimitData({ date: getTodayDate(), count: 0 });
  console.log('🔄 Günlük limit sıfırlandı');
}

// ============================================
// Kayıtlı Şarkılar Fonksiyonları
// ============================================

/**
 * Tüm kayıtlı şarkıları getirir
 */
export async function getSavedSongs(): Promise<SavedSong[]> {
  try {
    const data = await AsyncStorage.getItem(SAVED_SONGS_KEY);
    if (data) {
      return JSON.parse(data) as SavedSong[];
    }
  } catch (error) {
    console.error('Kayıtlı şarkılar okuma hatası:', error);
  }
  return [];
}

/**
 * Şarkı kaydeder
 */
export async function saveSong(song: Omit<SavedSong, 'id' | 'savedAt'>): Promise<SavedSong> {
  const songs = await getSavedSongs();
  
  // Aynı şarkı varsa güncelle
  const existingIndex = songs.findIndex(
    s => s.artist.toLowerCase() === song.artist.toLowerCase() && 
         s.title.toLowerCase() === song.title.toLowerCase()
  );
  
  const newSong: SavedSong = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...song,
    savedAt: new Date().toISOString(),
  };
  
  if (existingIndex >= 0) {
    songs[existingIndex] = { ...songs[existingIndex], ...newSong, id: songs[existingIndex].id };
    console.log('🔄 Şarkı güncellendi:', song.title);
  } else {
    songs.unshift(newSong); // Yeniler başa
    console.log('💾 Yeni şarkı kaydedildi:', song.title);
  }
  
  try {
    await AsyncStorage.setItem(SAVED_SONGS_KEY, JSON.stringify(songs));
  } catch (error) {
    console.error('Şarkı kaydetme hatası:', error);
  }
  
  return newSong;
}

/**
 * Şarkı siler
 */
export async function deleteSong(songId: string): Promise<void> {
  const songs = await getSavedSongs();
  const filtered = songs.filter(s => s.id !== songId);
  
  try {
    await AsyncStorage.setItem(SAVED_SONGS_KEY, JSON.stringify(filtered));
    console.log('🗑️ Şarkı silindi');
  } catch (error) {
    console.error('Şarkı silme hatası:', error);
  }
}

/**
 * Şarkının kayıtlı olup olmadığını kontrol eder
 */
export async function isSongSaved(artist: string, title: string): Promise<SavedSong | null> {
  const songs = await getSavedSongs();
  return songs.find(
    s => s.artist.toLowerCase() === artist.toLowerCase() && 
         s.title.toLowerCase() === title.toLowerCase()
  ) || null;
}

/**
 * Tüm kayıtlı şarkıları siler
 */
export async function clearAllSavedSongs(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SAVED_SONGS_KEY);
    console.log('🗑️ Tüm kayıtlı şarkılar silindi');
  } catch (error) {
    console.error('Şarkıları silme hatası:', error);
  }
}

/**
 * Günlük limiti ve kayıtlı şarkı sayısını döndürür
 */
export async function getSearchStats(): Promise<{
  remaining: number;
  total: number;
  savedCount: number;
}> {
  const remaining = await getRemainingSearches();
  const songs = await getSavedSongs();
  
  return {
    remaining,
    total: DAILY_SEARCH_LIMIT,
    savedCount: songs.length,
  };
}

