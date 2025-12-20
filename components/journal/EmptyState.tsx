import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

const emptyMessages = [
  {
    emoji: '😢',
    title: "You haven't written anything yet",
    subtitle: "Start your journey today!"
  },
  {
    emoji: '🥺',
    title: "No entries this month",
    subtitle: "How about writing something beautiful?"
  },
  {
    emoji: '💭',
    title: "Your thoughts are waiting",
    subtitle: "Share your story with yourself"
  },
  {
    emoji: '✨',
    title: "This month is still empty",
    subtitle: "Let's fill it with memories!"
  },
  {
    emoji: '🌙',
    title: "Did you forget about today, sweetie?",
    subtitle: "It's never too late to write"
  },
  {
    emoji: '💫',
    title: "No memories captured yet",
    subtitle: "Every day deserves a story"
  },
];

interface EmptyStateProps {
  month?: string;
}

export default function EmptyState({ month }: EmptyStateProps) {
  // Random mesaj seç
  const randomMessage = emptyMessages[Math.floor(Math.random() * emptyMessages.length)];
  
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{randomMessage.emoji}</Text>
      <Text style={styles.title}>{randomMessage.title}</Text>
      {month && (
        <Text style={styles.month}>in {month}</Text>
      )}
      <Text style={styles.subtitle}>{randomMessage.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  month: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

