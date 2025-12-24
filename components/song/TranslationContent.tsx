import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

interface TranslationContentProps {
  translation: string | undefined;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  theme: any;
}

/**
 * Çeviri içerik komponenti
 */
export function TranslationContent({ 
  translation, 
  isLoading = false,
  error = null,
  onRetry,
  theme 
}: TranslationContentProps) {
  // Yükleniyor durumu
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Çeviri yapılıyor...
          </Text>
          <Text style={[styles.loadingHint, { color: theme.textSecondary }]}>
            Bu işlem birkaç saniye sürebilir
          </Text>
        </View>
      </View>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorText, { color: theme.textSecondary }]}>
            {error}
          </Text>
          {onRetry && (
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: theme.primary }]}
              onPress={onRetry}
            >
              <Text style={styles.retryButtonText}>Tekrar Dene</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Çeviri yoksa
  if (!translation) {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🌐</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Şarkı sözleri yüklendikten sonra çeviri otomatik yapılacak
          </Text>
        </View>
      </View>
    );
  }

  // Çeviri göster
  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.textSecondary }]}>
          🇹🇷 Türkçe Çeviri
        </Text>
      </View>
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
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  translationText: {
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
    fontSize: 16,
    fontWeight: '600',
  },
  loadingHint: {
    marginTop: 8,
    fontSize: 13,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
