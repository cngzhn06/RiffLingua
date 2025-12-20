import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useTheme } from '@/contexts/ThemeContext';
import { todaysSong } from '@/data/songs';
import { Song } from '@/types/song';

const { width } = Dimensions.get('window');

export default function SongScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'lyrics' | 'vocabulary' | 'translation'>('lyrics');
  const [playing, setPlaying] = useState(false);
  const song = todaysSong;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#4CAF50';
      case 'Intermediate':
        return '#FF9800';
      case 'Advanced':
        return '#F44336';
      default:
        return theme.primary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* YouTube Player */}
        <View style={styles.videoContainer}>
          <YoutubePlayer
            height={220}
            play={playing}
            videoId={song.youtubeId}
            onChangeState={(state: string) => {
              if (state === 'ended') {
                setPlaying(false);
              }
            }}
          />
        </View>

        {/* Song Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.infoHeader}>
            <View style={styles.titleSection}>
              <Text style={[styles.songTitle, { color: theme.textPrimary }]}>
                {song.title}
              </Text>
              <Text style={[styles.artistName, { color: theme.textSecondary }]}>
                {song.artist}
              </Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(song.difficulty) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(song.difficulty) },
                ]}
              >
                {song.difficulty}
              </Text>
            </View>
          </View>

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱️</Text>
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {song.duration}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🎸</Text>
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {song.genre}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📚</Text>
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {song.vocabularyWords?.length || 0} words
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabContainer, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'lyrics' && [
                styles.activeTab,
                { borderBottomColor: theme.primary },
              ],
            ]}
            onPress={() => setActiveTab('lyrics')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'lyrics' ? theme.primary : theme.textSecondary },
              ]}
            >
              📝 Lyrics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'vocabulary' && [
                styles.activeTab,
                { borderBottomColor: theme.primary },
              ],
            ]}
            onPress={() => setActiveTab('vocabulary')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'vocabulary' ? theme.primary : theme.textSecondary },
              ]}
            >
              📚 Vocabulary
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'translation' && [
                styles.activeTab,
                { borderBottomColor: theme.primary },
              ],
            ]}
            onPress={() => setActiveTab('translation')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'translation' ? theme.primary : theme.textSecondary },
              ]}
            >
              🌐 Translation
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {activeTab === 'lyrics' && (
            <View style={[styles.contentCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.lyricsText, { color: theme.textPrimary }]}>
                {song.lyrics}
              </Text>
            </View>
          )}

          {activeTab === 'vocabulary' && (
            <View style={styles.vocabularyList}>
              {song.vocabularyWords?.map((word, index) => (
                <View
                  key={index}
                  style={[styles.vocabularyCard, { backgroundColor: theme.cardBackground }]}
                >
                  <View style={styles.wordHeader}>
                    <Text style={[styles.word, { color: theme.primary }]}>{word.word}</Text>
                    {word.timestamp && (
                      <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
                        {word.timestamp}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.meaning, { color: theme.textSecondary }]}>
                    {word.meaning}
                  </Text>
                  <View style={[styles.exampleBox, { backgroundColor: theme.lightGray }]}>
                    <Text style={[styles.exampleLabel, { color: theme.textSecondary }]}>
                      Example:
                    </Text>
                    <Text style={[styles.example, { color: theme.textPrimary }]}>
                      "{word.example}"
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'translation' && (
            <View style={[styles.contentCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.translationText, { color: theme.textPrimary }]}>
                {song.translation}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
  },
  infoCard: {
    padding: 20,
    marginHorizontal: 16,
    marginTop: -30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIcon: {
    fontSize: 16,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  contentCard: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lyricsText: {
    fontSize: 16,
    lineHeight: 28,
    fontFamily: 'System',
  },
  translationText: {
    fontSize: 16,
    lineHeight: 28,
    fontFamily: 'System',
  },
  vocabularyList: {
    gap: 16,
  },
  vocabularyCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  word: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '600',
  },
  meaning: {
    fontSize: 16,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  exampleBox: {
    padding: 12,
    borderRadius: 8,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  example: {
    fontSize: 15,
    lineHeight: 22,
  },
});
