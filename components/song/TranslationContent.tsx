import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TranslationContentProps {
  translation: string | undefined;
  theme: any;
}

/**
 * Çeviri içerik komponenti
 */
export function TranslationContent({ translation, theme }: TranslationContentProps) {
  if (!translation) {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Bu şarkı için çeviri henüz eklenmedi
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.translationText, { color: theme.textPrimary }]}>
        {translation}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  translationText: {
    fontSize: 16,
    lineHeight: 28,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

