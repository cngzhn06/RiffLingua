import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { mockJournals } from '@/data/mockJournals';
import StarRating from '@/components/StarRating';
import { Colors } from '@/constants/colors';

export default function SingleDayJournalScreen() {
  const { date } = useLocalSearchParams();
  const router = useRouter();
  
  const entry = mockJournals.find(j => j.date === date);
  const [rating, setRating] = useState(entry?.rating || 0);

  if (!entry) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.noEntry}>No journal entry for this date</Text>
          <TouchableOpacity 
            style={styles.createButton}
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Date Header */}
          <View style={styles.dateHeader}>
            <Text style={styles.date}>{formatDate(entry.date)}</Text>
            {entry.mood && <Text style={styles.mood}>{entry.mood}</Text>}
          </View>

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

          {/* Title */}
          <Text style={styles.title}>{entry.title}</Text>

          {/* Content */}
          <View style={styles.contentSection}>
            <Text style={styles.journalContent}>{entry.content}</Text>
          </View>

          {/* Metadata */}
          <View style={styles.metadataGrid}>
            {entry.location && (
              <View style={styles.metadataCard}>
                <Text style={styles.metadataIcon}>📍</Text>
                <Text style={styles.metadataLabel}>Location</Text>
                <Text style={styles.metadataValue}>{entry.location}</Text>
              </View>
            )}
          </View>

          {/* Edit Button */}
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/screens/write-day')}
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
    backgroundColor: Colors.background,
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
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: Colors.surface,
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
    color: Colors.textLight,
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
    backgroundColor: Colors.primaryLight + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
    lineHeight: 40,
  },
  ratingSection: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: Colors.primaryLight + '20',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingLabel: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
  },
  ratingText: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  contentSection: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.primaryLight + '20',
  },
  journalContent: {
    fontSize: 17,
    color: Colors.text,
    lineHeight: 28,
  },
  metadataGrid: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  metadataCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 6,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.primaryLight + '20',
  },
  metadataIcon: {
    fontSize: 28,
  },
  metadataLabel: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metadataValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonText: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
