import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/common/Card';
import { Colors } from '@/constants/colors';

interface StatItemProps {
  number: number;
  label: string;
}

interface StatsCardProps {
  dayStreak: number;
  totalEntries: number;
  totalSongs: number;
}

function StatItem({ number, label }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function StatsCard({ dayStreak, totalEntries, totalSongs }: StatsCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>🔥 Your Progress</Text>
      <View style={styles.statsRow}>
        <StatItem number={dayStreak} label="Day Streak" />
        <View style={styles.divider} />
        <StatItem number={totalEntries} label="Entries" />
        <View style={styles.divider} />
        <StatItem number={totalSongs} label="Songs" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.backgroundDark,
  },
});

