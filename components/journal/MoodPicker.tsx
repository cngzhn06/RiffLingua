import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';

const moods = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😢', label: 'Sad', value: 'sad' },
  { emoji: '😡', label: 'Angry', value: 'angry' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '😎', label: 'Cool', value: 'cool' },
  { emoji: '🤩', label: 'Excited', value: 'excited' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '🥺', label: 'Anxious', value: 'anxious' },
  { emoji: '😍', label: 'Loved', value: 'loved' },
  { emoji: '🤔', label: 'Thoughtful', value: 'thoughtful' },
];

interface MoodPickerProps {
  selectedMood?: string;
  onSelectMood: (mood: string) => void;
}

export default function MoodPicker({ selectedMood, onSelectMood }: MoodPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>How are you feeling?</Text>
      <View style={styles.moodGrid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.moodButton,
              selectedMood === mood.emoji && styles.selectedMood,
            ]}
            onPress={() => onSelectMood(mood.emoji)}
            activeOpacity={0.7}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryLight + '20',
    padding: 8,
  },
  selectedMood: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
    transform: [{ scale: 1.05 }],
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

