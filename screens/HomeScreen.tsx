import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import ActivityCard from '@/components/home/ActivityCard';
import StatsCard from '@/components/home/StatsCard';

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
          <ActivityCard
            icon="🎵"
            label="SONG OF THE DAY"
            title="Bad Guy"
            subtitle="Billie Eilish"
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
});
