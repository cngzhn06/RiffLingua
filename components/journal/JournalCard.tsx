import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { JournalEntry } from '@/types/journal';
import StarRating from '@/components/common/StarRating';
import JournalCardMenu from './JournalCardMenu';
import { Colors } from '@/constants/colors';

interface JournalCardProps {
  entry: JournalEntry;
  onPress: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export default function JournalCard({ entry, onPress, onDelete, onEdit }: JournalCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Images Grid */}
      {entry.images && entry.images.length > 0 && (
        <View style={styles.imagesGrid}>
          {entry.images.slice(0, 4).map((img, index) => (
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

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{entry.title}</Text>
          <View style={styles.titleActions}>
            {entry.rating && <StarRating rating={entry.rating} readonly size="small" />}
            <JournalCardMenu onDelete={onDelete} onEdit={onEdit} />
          </View>
        </View>
        <Text style={styles.description} numberOfLines={3}>
          {entry.content}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
          <View style={styles.metadata}>
            {entry.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingEmoji}>
                  {entry.rating === 5 ? '🤩' : 
                   entry.rating === 4 ? '😊' : 
                   entry.rating === 3 ? '😐' : 
                   entry.rating === 2 ? '😕' : '😢'}
                </Text>
              </View>
            )}
            {entry.location && (
              <View style={styles.metadataItem}>
                <Text style={styles.metadataIcon}>📍</Text>
                <Text style={styles.metadataText} numberOfLines={1}>{entry.location}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 200,
  },
  imageBox: {
    width: '50%',
    height: '50%',
    padding: 2,
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },
  doubleImage: {
    width: '50%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: Colors.primaryLight + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  imagePlaceholderText: {
    fontSize: 40,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  titleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    gap: 12,
  },
  date: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: '500',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  ratingBadge: {
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingEmoji: {
    fontSize: 18,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  metadataIcon: {
    fontSize: 14,
  },
  metadataText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
