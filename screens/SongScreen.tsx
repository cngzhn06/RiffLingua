import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Context
import { useTheme } from '@/contexts/ThemeContext';

// Hooks
import { useLyrics } from '@/hooks/useLyrics';
import { useTranslation } from '@/hooks/useTranslation';

// Services
import { searchYouTubeVideo, YouTubeVideo } from '@/services/youtubeService';

// Components
import {
  YouTubePlayerComponent,
  SongSearch,
  TabBar,
  LyricsContent,
  VocabularyList,
  TranslationContent,
  TabType,
} from '@/components/song';

/**
 * Şarkı ekranı - Şarkı arama, YouTube video ve sözleri gösterimi
 */
export default function SongScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('lyrics');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Aranan şarkı bilgileri
  const [searchedSong, setSearchedSong] = useState<{ artist: string; title: string } | null>(null);
  
  // YouTube video
  const [youtubeVideo, setYoutubeVideo] = useState<YouTubeVideo | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Lyrics hook - arama yapıldığında çalışır
  const { lyrics, isLoading: lyricsLoading, error } = useLyrics({
    artist: searchedSong?.artist || '',
    title: searchedSong?.title || '',
    initialLyrics: undefined,
  });

  // Translation hook - lyrics yüklendiğinde ve translation sekmesi aktifken çalışır
  const { 
    translation, 
    isLoading: translationLoading, 
    error: translationError,
    refetch: refetchTranslation,
  } = useTranslation({
    text: lyrics,
    targetLang: 'tr',
    enabled: activeTab === 'translation' && !!lyrics,
  });

  // YouTube video ara
  useEffect(() => {
    const fetchVideo = async () => {
      if (!searchedSong) {
        setYoutubeVideo(null);
        return;
      }

      setVideoLoading(true);
      try {
        const video = await searchYouTubeVideo(searchedSong.artist, searchedSong.title);
        setYoutubeVideo(video);
      } catch (err) {
        console.error('YouTube video arama hatası:', err);
      } finally {
        setVideoLoading(false);
      }
    };

    fetchVideo();
  }, [searchedSong]);

  const handleSearch = useCallback((artist: string, title: string) => {
    setSearchedSong({ artist, title });
    setIsPlaying(false);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchedSong(null);
    setYoutubeVideo(null);
  }, []);

  const handleVideoStateChange = (state: string) => {
    if (state === 'ended') {
      setIsPlaying(false);
    }
  };

  const isLoading = lyricsLoading || videoLoading;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Şarkı Arama - Arama yapılınca küçülür */}
        <SongSearch
          onSearch={handleSearch}
          isLoading={isLoading}
          theme={theme}
          isCollapsed={!!searchedSong}
          currentSong={searchedSong}
          onClear={handleClearSearch}
        />

        {/* Aranan şarkı varsa göster */}
        {searchedSong && (
          <>
            {/* YouTube Player */}
            {youtubeVideo ? (
              <YouTubePlayerComponent
                videoId={youtubeVideo.videoId}
                playing={isPlaying}
                onStateChange={handleVideoStateChange}
              />
            ) : videoLoading ? (
              <View style={[styles.videoPlaceholder, { backgroundColor: '#000' }]}>
                <Text style={styles.videoPlaceholderText}>🎬 Video yükleniyor...</Text>
              </View>
            ) : (
              <View style={[styles.videoPlaceholder, { backgroundColor: '#1a1a1a' }]}>
                <Text style={styles.videoPlaceholderIcon}>🎵</Text>
                <Text style={styles.videoPlaceholderText}>Video bulunamadı</Text>
              </View>
            )}

            {/* Şarkı Başlığı */}
            <View style={[styles.songHeader, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.songTitle, { color: theme.textPrimary }]}>
                {searchedSong.title}
              </Text>
              <Text style={[styles.songArtist, { color: theme.textSecondary }]}>
                {searchedSong.artist}
              </Text>
              {youtubeVideo && (
                <View style={[styles.channelBadge, { backgroundColor: theme.primary + '15' }]}>
                  <Text style={[styles.channelName, { color: theme.primary }]}>
                    📺 {youtubeVideo.channelTitle}
                  </Text>
                </View>
              )}
            </View>

            {/* Tab Navigasyonu */}
            <TabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              theme={theme}
            />

            {/* Tab İçerikleri */}
            <View style={styles.contentContainer}>
              {activeTab === 'lyrics' && (
                <LyricsContent
                  lyrics={lyrics}
                  isLoading={lyricsLoading}
                  error={error}
                  theme={theme}
                />
              )}

              {activeTab === 'vocabulary' && (
                <VocabularyList
                  words={[]}
                  theme={theme}
                />
              )}

              {activeTab === 'translation' && (
                <TranslationContent
                  translation={translation}
                  isLoading={translationLoading}
                  error={translationError}
                  onRetry={refetchTranslation}
                  theme={theme}
                />
              )}
            </View>
          </>
        )}

        {/* Henüz arama yapılmadıysa */}
        {!searchedSong && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎶</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              Şarkı Sözleri Keşfet
            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Yukarıdaki arama kutusuna sanatçı ve şarkı adını girerek şarkı sözlerini görüntüleyin
            </Text>
          </View>
        )}

        {/* Alt Boşluk */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoPlaceholder: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  videoPlaceholderText: {
    color: '#888',
    fontSize: 14,
  },
  songHeader: {
    marginHorizontal: 16,
    marginTop: -30,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 16,
    fontWeight: '600',
  },
  channelBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  channelName: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 40,
  },
});
