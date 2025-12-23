import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Context
import { useTheme } from '@/contexts/ThemeContext';

// Hooks
import { useLyrics } from '@/hooks/useLyrics';

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

  const handleVideoStateChange = (state: string) => {
    if (state === 'ended') {
      setIsPlaying(false);
    }
  };

  const isLoading = lyricsLoading || videoLoading;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Şarkı Arama */}
        <SongSearch
          onSearch={handleSearch}
          isLoading={isLoading}
          theme={theme}
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
              <View style={[styles.videoPlaceholder, { backgroundColor: '#000' }]}>
                <Text style={styles.videoPlaceholderText}>🎬 Video bulunamadı</Text>
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
                <Text style={[styles.channelName, { color: theme.textSecondary }]}>
                  📺 {youtubeVideo.channelTitle}
                </Text>
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
                  translation={undefined}
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
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Şarkı sözlerini ve videosunu görmek için yukarıdan arama yapın
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
  videoPlaceholderText: {
    color: '#fff',
    fontSize: 16,
  },
  songHeader: {
    marginHorizontal: 16,
    marginTop: -30,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  channelName: {
    fontSize: 12,
    marginTop: 8,
  },
  contentContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  bottomSpacer: {
    height: 40,
  },
});
