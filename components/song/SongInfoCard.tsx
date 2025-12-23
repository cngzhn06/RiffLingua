import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Song } from '@/types/song';

interface SongInfoCardProps {
  song: Song;
  theme: any;
}

const DIFFICULTY_COLORS = {
  Beginner: '#4CAF50',
  Intermediate: '#FF9800',
  Advanced: '#F44336',
} as const;

/**
 * Şarkı bilgi kartı komponenti
 */
export function SongInfoCard({ song, theme }: SongInfoCardProps) {
  const difficultyColor = DIFFICULTY_COLORS[song.difficulty] || theme.primary;

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      {/* Başlık ve Zorluk */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {song.title}
          </Text>
          <Text style={[styles.artist, { color: theme.textSecondary }]}>
            {song.artist}
          </Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor + '20' }]}>
          <Text style={[styles.difficultyText, { color: difficultyColor }]}>
            {song.difficulty}
          </Text>
        </View>
      </View>

      {/* Meta Bilgiler */}
      <View style={styles.metaInfo}>
        <MetaItem icon="⏱️" text={song.duration || ''} theme={theme} />
        <MetaItem icon="🎸" text={song.genre || ''} theme={theme} />
        <MetaItem icon="📚" text={`${song.vocabularyWords?.length || 0} words`} theme={theme} />
      </View>
    </View>
  );
}

interface MetaItemProps {
  icon: string;
  text: string;
  theme: any;
}

function MetaItem({ icon, text, theme }: MetaItemProps) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaIcon}>{icon}</Text>
      <Text style={[styles.metaText, { color: theme.textSecondary }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artist: {
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
});

