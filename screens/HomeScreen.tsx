import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>✨</Text>
          <Text style={styles.headerTitle}>Today's Practice</Text>
          <Text style={styles.headerSubtitle}>Choose your learning adventure</Text>
        </View>

        <View style={styles.content}>
          {/* Song of the Day */}
          <TouchableOpacity 
            style={[styles.card, styles.songCard]}
            onPress={() => router.push('/screens/song')}
            activeOpacity={0.85}
          >
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIconLarge}>🎵</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardLabel, styles.songLabel]}>SONG OF THE DAY</Text>
              <Text style={styles.cardTitle}>Bad Guy</Text>
              <Text style={styles.cardSubtitle}>Billie Eilish</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Movie Clip of the Day */}
          <TouchableOpacity 
            style={[styles.card, styles.movieCard]}
            onPress={() => router.push('/screens/movie-clip')}
            activeOpacity={0.85}
          >
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIconLarge}>🎬</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardLabel, styles.movieLabel]}>MOVIE CLIP</Text>
              <Text style={styles.cardTitle}>Friends</Text>
              <Text style={styles.cardSubtitle}>Season 1, Episode 1</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Daily Journal */}
          <TouchableOpacity 
            style={[styles.card, styles.journalCard]}
            onPress={() => router.push('/screens/daily-journal')}
            activeOpacity={0.85}
          >
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIconLarge}>📝</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardLabel, styles.journalLabel]}>DAILY JOURNAL</Text>
              <Text style={styles.cardTitle}>Write Your Story</Text>
              <Text style={styles.cardSubtitle}>Express yourself in English</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>🔥 Your Progress</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>7</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Entries</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Songs</Text>
              </View>
            </View>
          </View>
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
  header: {
    backgroundColor: Colors.primary,
    padding: 32,
    paddingTop: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 17,
    color: Colors.surface + 'DD',
    fontWeight: '500',
  },
  content: {
    padding: 20,
    paddingTop: 24,
    gap: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 24,
    padding: 28,
    minHeight: 180,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  songCard: {
    backgroundColor: '#FF6B9D',
  },
  movieCard: {
    backgroundColor: '#6C63FF',
  },
  journalCard: {
    backgroundColor: '#00D9A3',
  },
  cardIconContainer: {
    marginBottom: 12,
  },
  cardIconLarge: {
    fontSize: 56,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
    opacity: 0.9,
  },
  songLabel: {
    color: '#FFFFFF',
  },
  movieLabel: {
    color: '#FFFFFF',
  },
  journalLabel: {
    color: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    color: Colors.surface + 'DD',
    fontWeight: '500',
  },
  arrowContainer: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  arrow: {
    fontSize: 32,
    color: Colors.surface,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 28,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: Colors.primaryLight + '20',
  },
  statsTitle: {
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
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.backgroundDark,
  },
});
