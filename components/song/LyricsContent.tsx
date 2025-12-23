import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface LyricsContentProps {
  lyrics: string | undefined;
  isLoading: boolean;
  error: string | null;
  theme: any;
}

/**
 * Şarkı sözleri içerik komponenti
 */
export function LyricsContent({ lyrics, isLoading, error, theme }: LyricsContentProps) {
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Şarkı sözleri yükleniyor...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.textSecondary }]}>
            ⚠️ {error}
          </Text>
        </View>
      </View>
    );
  }

  if (!lyrics) {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>
          Şarkı sözleri bulunamadı
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.lyricsText, { color: theme.textPrimary }]}>
        {lyrics}
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
  lyricsText: {
    fontSize: 16,
    lineHeight: 28,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  errorContainer: {
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

