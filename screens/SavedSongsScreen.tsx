import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import {
  getSavedSongs,
  deleteSong,
  SavedSong,
  getSearchStats,
} from '@/services/songLimitService';

export default function SavedSongsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [songs, setSongs] = useState<SavedSong[]>([]);
  const [stats, setStats] = useState({ remaining: 2, total: 2, savedCount: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [savedSongs, searchStats] = await Promise.all([
      getSavedSongs(),
      getSearchStats(),
    ]);
    setSongs(savedSongs);
    setStats(searchStats);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleSongPress = (song: SavedSong) => {
    // Şarkı detay sayfasına yönlendir (limit harcamadan)
    router.push({
      pathname: '/screens/song',
      params: {
        artist: song.artist,
        title: song.title,
        fromSaved: 'true',
        videoId: song.videoId || '',
        channelTitle: song.channelTitle || '',
      },
    });
  };

  const handleDeleteSong = (song: SavedSong) => {
    Alert.alert(
      'Şarkıyı Sil',
      `"${song.title}" şarkısını silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await deleteSong(song.id);
            await loadData();
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderSongItem = ({ item }: { item: SavedSong }) => (
    <TouchableOpacity
      style={[styles.songItem, { backgroundColor: theme.cardBackground }]}
      onPress={() => handleSongPress(item)}
      onLongPress={() => handleDeleteSong(item)}
      activeOpacity={0.7}
    >
      <View style={styles.songIcon}>
        <Text style={styles.songIconText}>🎵</Text>
      </View>
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: theme.textPrimary }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.songArtist, { color: theme.textSecondary }]} numberOfLines={1}>
          {item.artist}
        </Text>
        <Text style={[styles.songDate, { color: theme.textSecondary }]}>
          📅 {formatDate(item.savedAt)}
        </Text>
      </View>
      <View style={styles.chevron}>
        <Text style={{ color: theme.textSecondary }}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        Henüz Kayıtlı Şarkı Yok
      </Text>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        Şarkı aradığınızda otomatik olarak buraya kaydedilecek
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Kayıtlı Şarkılar
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Limit harcamadan erişin
        </Text>
      </View>

      {/* Stats Card */}
      <View style={[styles.statsCard, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {stats.remaining}/{stats.total}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Günlük Hak
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {stats.savedCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Kayıtlı Şarkı
          </Text>
        </View>
      </View>

      {/* Info Banner */}
      <View style={[styles.infoBanner, { backgroundColor: theme.primary + '15' }]}>
        <Text style={[styles.infoText, { color: theme.primary }]}>
          💡 Kayıtlı şarkılara erişmek günlük hakkınızı harcamaz
        </Text>
      </View>

      {/* Song List */}
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    marginVertical: 8,
  },
  infoBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  listContent: {
    padding: 20,
    paddingTop: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  songIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  songIconText: {
    fontSize: 24,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 14,
    marginBottom: 4,
  },
  songDate: {
    fontSize: 11,
  },
  chevron: {
    paddingLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

