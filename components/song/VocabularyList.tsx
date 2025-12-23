import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VocabularyWord } from '@/types/song';

interface VocabularyListProps {
  words: VocabularyWord[];
  theme: any;
}

/**
 * Kelime listesi komponenti
 */
export function VocabularyList({ words, theme }: VocabularyListProps) {
  if (!words || words.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Bu şarkı için kelime listesi henüz eklenmedi
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {words.map((word, index) => (
        <VocabularyCard key={index} word={word} theme={theme} />
      ))}
    </View>
  );
}

interface VocabularyCardProps {
  word: VocabularyWord;
  theme: any;
}

function VocabularyCard({ word, theme }: VocabularyCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
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

