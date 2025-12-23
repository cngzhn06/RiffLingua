import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Context
import { useTheme } from '@/contexts/ThemeContext';

// Hooks
import { useLyrics } from '@/hooks/useLyrics';

// Data
import { todaysSong } from '@/data/songs';

// Components
import {
  YouTubePlayerComponent,
  SongInfoCard,
  TabBar,
  LyricsContent,
  VocabularyList,
  TranslationContent,
  TabType,
} from '@/components/song';

/**
 * Şarkı ekranı - YouTube video ve şarkı sözleri gösterimi
 */
export default function SongScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('lyrics');
  const [isPlaying, setIsPlaying] = useState(false);

  // Lyrics hook - API'den dinamik olarak şarkı sözlerini çeker
  const { lyrics, isLoading, error } = useLyrics({
    artist: todaysSong.artist,
    title: todaysSong.title,
    initialLyrics: todaysSong.lyrics,
  });

  const handleVideoStateChange = (state: string) => {
    if (state === 'ended') {
      setIsPlaying(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* YouTube Player */}
        <YouTubePlayerComponent
          videoId={todaysSong.youtubeId}
          playing={isPlaying}
          onStateChange={handleVideoStateChange}
        />

        {/* Şarkı Bilgileri */}
        <SongInfoCard song={todaysSong} theme={theme} />

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
              isLoading={isLoading}
              error={error}
              theme={theme}
            />
          )}

          {activeTab === 'vocabulary' && (
            <VocabularyList
              words={todaysSong.vocabularyWords || []}
              theme={theme}
            />
          )}

          {activeTab === 'translation' && (
            <TranslationContent
              translation={todaysSong.translation}
              theme={theme}
            />
          )}
        </View>

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
  contentContainer: {
    padding: 16,
  },
  bottomSpacer: {
    height: 40,
  },
});
