import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/common/Card';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statNumber, { color: theme.primary }]}>{number}</Text>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
}

export default function StatsCard({ dayStreak, totalEntries, totalSongs }: StatsCardProps) {
  const { theme } = useTheme();
  
  return (
    <Card style={styles.card}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>🔥 Your Progress</Text>
      <View style={styles.statsRow}>
        <StatItem number={dayStreak} label="Day Streak" />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <StatItem number={totalEntries} label="Entries" />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 40,
  },
});

