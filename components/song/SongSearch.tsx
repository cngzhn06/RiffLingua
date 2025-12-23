import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface SongSearchProps {
  onSearch: (artist: string, title: string) => void;
  isLoading: boolean;
  theme: any;
}

/**
 * Şarkı arama komponenti
 */
export function SongSearch({ onSearch, isLoading, theme }: SongSearchProps) {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');

  const handleSearch = () => {
    if (artist.trim() && title.trim()) {
      onSearch(artist.trim(), title.trim());
    }
  };

  const isDisabled = !artist.trim() || !title.trim() || isLoading;

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.label, { color: theme.textPrimary }]}>🎵 Şarkı Ara</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.background,
              color: theme.textPrimary,
              borderColor: theme.border || '#ddd',
            },
          ]}
          placeholder="Sanatçı adı"
          placeholderTextColor={theme.textSecondary}
          value={artist}
          onChangeText={setArtist}
          autoCapitalize="words"
          autoCorrect={false}
        />
        
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.background,
              color: theme.textPrimary,
              borderColor: theme.border || '#ddd',
            },
          ]}
          placeholder="Şarkı adı"
          placeholderTextColor={theme.textSecondary}
          value={title}
          onChangeText={setTitle}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.searchButton,
          { backgroundColor: isDisabled ? theme.textSecondary : theme.primary },
        ]}
        onPress={handleSearch}
        disabled={isDisabled}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
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
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputContainer: {
    gap: 12,
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  searchButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

