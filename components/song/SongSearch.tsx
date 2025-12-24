import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Keyboard,
} from 'react-native';

interface SongSearchProps {
  onSearch: (artist: string, title: string) => void;
  isLoading: boolean;
  theme: any;
  isCollapsed?: boolean;
  currentSong?: { artist: string; title: string } | null;
  onClear?: () => void;
}

/**
 * Şarkı arama komponenti - Arama sonrası küçülür
 */
export function SongSearch({ 
  onSearch, 
  isLoading, 
  theme, 
  isCollapsed = false,
  currentSong,
  onClear,
}: SongSearchProps) {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(!isCollapsed);
  
  const animatedHeight = useRef(new Animated.Value(isCollapsed ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const handleSearch = () => {
    if (artist.trim() && title.trim()) {
      Keyboard.dismiss();
      onSearch(artist.trim(), title.trim());
      setIsExpanded(false);
    }
  };

  const handleNewSearch = () => {
    setArtist('');
    setTitle('');
    setIsExpanded(true);
    onClear?.();
  };

  const isDisabled = !artist.trim() || !title.trim() || isLoading;

  // Küçültülmüş görünüm - sadece mevcut şarkı ve yeni arama butonu
  if (!isExpanded && currentSong) {
    return (
      <TouchableOpacity 
        style={[styles.collapsedContainer, { backgroundColor: theme.cardBackground }]}
        onPress={handleNewSearch}
        activeOpacity={0.7}
      >
        <View style={styles.collapsedContent}>
          <View style={styles.collapsedInfo}>
            <Text style={[styles.collapsedIcon]}>🎵</Text>
            <View style={styles.collapsedTextContainer}>
              <Text style={[styles.collapsedTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                {currentSong.title}
              </Text>
              <Text style={[styles.collapsedArtist, { color: theme.textSecondary }]} numberOfLines={1}>
                {currentSong.artist}
              </Text>
            </View>
          </View>
          <View style={[styles.newSearchBadge, { backgroundColor: theme.primary + '20' }]}>
            <Text style={[styles.newSearchText, { color: theme.primary }]}>Yeni Ara</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Genişletilmiş görünüm - tam arama formu
  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>🎵 Şarkı Ara</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Sanatçı ve şarkı adını girin
        </Text>
      </View>
      
      {/* Input alanları - yan yana */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Sanatçı</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.background,
                color: theme.textPrimary,
                borderColor: artist ? theme.primary : (theme.border || '#ddd'),
              },
            ]}
            placeholder="A Perfect Circle"
            placeholderTextColor={theme.textSecondary + '80'}
            value={artist}
            onChangeText={setArtist}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>
        
        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Şarkı</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.background,
                color: theme.textPrimary,
                borderColor: title ? theme.primary : (theme.border || '#ddd'),
              },
            ]}
            placeholder="Judith"
            placeholderTextColor={theme.textSecondary + '80'}
            value={title}
            onChangeText={setTitle}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {/* Arama butonu */}
      <TouchableOpacity
        style={[
          styles.searchButton,
          { 
            backgroundColor: isDisabled ? (theme.textSecondary + '40') : theme.primary,
            opacity: isDisabled ? 0.6 : 1,
          },
        ]}
        onPress={handleSearch}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.searchButtonText}>Aranıyor...</Text>
          </View>
        ) : (
          <Text style={styles.searchButtonText}>🔍 Şarkı Sözlerini Getir</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1.5,
  },
  searchButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Collapsed styles
  collapsedContainer: {
    margin: 16,
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  collapsedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collapsedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  collapsedIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  collapsedTextContainer: {
    flex: 1,
  },
  collapsedTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  collapsedArtist: {
    fontSize: 13,
    marginTop: 2,
  },
  newSearchBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  newSearchText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
