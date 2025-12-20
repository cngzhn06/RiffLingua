import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import ActivityCard from '@/components/home/ActivityCard';
import StatsCard from '@/components/home/StatsCard';
import { useTheme } from '@/contexts/ThemeContext';
import { todaysSong } from '@/data/songs';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const song = todaysSong;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerEmoji}>✨</Text>
              <Text style={[styles.headerTitle, { color: theme.cardBackground }]}>Today's Practice</Text>
              <Text style={[styles.headerSubtitle, { color: theme.cardBackground + 'DD' }]}>Choose your learning adventure</Text>
            </View>
            <TouchableOpacity 
              style={[styles.settingsButton, { backgroundColor: theme.cardBackground + '20' }]}
              onPress={() => router.push('/screens/settings')}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Song of the Day */}
          <ActivityCard
            icon="🎵"
            label="SONG OF THE DAY"
            title={song.title}
            subtitle={song.artist}
            color="#FF6B9D"
            onPress={() => router.push('/screens/song')}
          />

          {/* Movie Clip of the Day */}
          <ActivityCard
            icon="🎬"
            label="MOVIE CLIP"
            title="Friends"
            subtitle="Season 1, Episode 1"
            color="#6C63FF"
            onPress={() => router.push('/screens/movie-clip')}
          />

          {/* Daily Journal */}
          <ActivityCard
            icon="📝"
            label="DAILY JOURNAL"
            title="Write Your Story"
            subtitle="Express yourself in English"
            color="#00D9A3"
            onPress={() => router.push('/screens/daily-journal')}
          />

          {/* Stats Card */}
          <StatsCard
            dayStreak={7}
            totalEntries={24}
            totalSongs={12}
          />
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
  header: {
    padding: 32,
    paddingTop: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 17,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    paddingTop: 24,
    gap: 20,
    paddingBottom: 40,
  },
});
