import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import { getJournalById, getJournalByDate } from '@/services/database';
import { JournalEntry } from '@/types/journal';
import { useTheme } from '@/contexts/ThemeContext';

export default function SingleDayJournalScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const id = params.id;
  const date = params.date;
  const key = params.key; // Unique key for forcing reload
  const router = useRouter();
  
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const loadEntry = async () => {
    try {
      setLoading(true);
      let journalEntry: JournalEntry | null = null;
      
      // Önce ID ile dene (DailyJournalScreen'den geliyorsa)
      if (id) {
        const idString = Array.isArray(id) ? id[0] : id;
        console.log('🔍 Loading entry by ID:', idString);
        journalEntry = await getJournalById(idString);
      }
      // ID yoksa date ile dene (CalendarModal'dan geliyorsa)
      else if (date) {
        const dateString = Array.isArray(date) ? date[0] : date;
        console.log('🔍 Loading entry by Date:', dateString);
        journalEntry = await getJournalByDate(dateString);
      }
      
      console.log('📄 Loaded entry:', journalEntry ? `ID: ${journalEntry.id}, Date: ${journalEntry.date}, Title: ${journalEntry.title?.substring(0, 30)}` : 'null');
      setEntry(journalEntry);
    } catch (error) {
      console.error('Error loading journal:', error);
    } finally {
      setLoading(false);
    }
  };

  // Key değiştiğinde yeniden yükle (her tıklamada farklı key)
  useEffect(() => {
    if (id || date) {
      loadEntry();
    }
  }, [key, id, date]);

  // Sayfa her göründüğünde de yeniden yükle (edit sonrası için)
  useFocusEffect(
    useCallback(() => {
      if (id || date) {
        loadEntry();
      }
    }, [id, date])
  );

  if (!entry) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={[styles.noEntry, { color: theme.textSecondary }]}>No journal entry for this date</Text>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/screens/write-day')}
          >
            <Text style={styles.createButtonText}>Create Entry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Date Header with Mood */}
          <View style={styles.dateHeader}>
            <Text style={[styles.date, { color: theme.textSecondary }]}>{formatDate(entry.date)}</Text>
            {entry.mood && <Text style={styles.mood}>{entry.mood}</Text>}
          </View>

          {/* Rating Display (View Only) */}
          {entry.rating && entry.rating > 0 && (
            <View style={[styles.ratingDisplay, {
              backgroundColor: theme.cardBackground,
              borderColor: theme.primary + '30',
            }]}>
              <Text style={styles.ratingEmoji}>
                {entry.rating === 5 ? '🤩' : 
                 entry.rating === 4 ? '😊' : 
                 entry.rating === 3 ? '😐' : 
                 entry.rating === 2 ? '😕' : '😢'}
              </Text>
              <Text style={[styles.ratingText, { color: theme.primary }]}>
                {'⭐'.repeat(entry.rating)}
              </Text>
            </View>
          )}

          {/* Images Grid */}
          {entry.images && entry.images.length > 0 && (
            <View style={styles.imagesGrid}>
              {entry.images.map((img, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.imageBox,
                    entry.images!.length === 1 && styles.singleImage,
                    entry.images!.length === 2 && styles.doubleImage,
                  ]}
                >
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>📷</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Quick Note as Title */}
          {entry.note && (
            <View style={styles.noteSection}>
              <Text style={[styles.noteTitle, { color: theme.textPrimary }]}>
                💭 {entry.note}
              </Text>
            </View>
          )}

          {/* Main Content */}
          <View style={[styles.contentSection, {
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
          }]}>
            <Text style={[styles.contentLabel, { color: theme.textSecondary }]}>Today's Journal</Text>
            <Text style={[styles.journalContent, { color: theme.textPrimary }]}>{entry.content}</Text>
          </View>

          {/* Metadata */}
          {entry.location && (
            <View style={styles.metadataGrid}>
              <View style={[styles.metadataCard, {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              }]}>
                <Text style={styles.metadataIcon}>📍</Text>
                <Text style={[styles.metadataLabel, { color: theme.textSecondary }]}>Location</Text>
                <Text style={[styles.metadataValue, { color: theme.textPrimary }]}>{entry.location}</Text>
              </View>
            </View>
          )}

          {/* Edit Button */}
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push({
              pathname: '/screens/write-day',
              params: {
                editMode: 'true',
                entryId: entry.id,
                date: entry.date,
                title: entry.title,
                content: entry.content,
                rating: entry.rating?.toString() || '0',
                mood: entry.mood || '',
                location: entry.location || '',
                note: entry.note || '',
              }
            })}
          >
            <Text style={styles.editButtonText}>✏️ Edit Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  noEntry: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  createButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
  },
  mood: {
    fontSize: 32,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 200,
  },
  imageBox: {
    width: '50%',
    height: 150,
    padding: 2,
  },
  singleImage: {
    width: '100%',
    height: 300,
  },
  doubleImage: {
    width: '50%',
    height: 300,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
  },
  ratingEmoji: {
    fontSize: 32,
  },
  ratingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noteSection: {
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  contentSection: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
  },
  contentLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  journalContent: {
    fontSize: 17,
    lineHeight: 28,
  },
  metadataGrid: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  metadataCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
  },
  metadataIcon: {
    fontSize: 28,
  },
  metadataLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metadataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
