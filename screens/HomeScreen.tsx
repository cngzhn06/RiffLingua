import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Practice</Text>
      </View>

      <View style={styles.content}>
        {/* Song of the Day */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🎵</Text>
            <Text style={styles.cardTitle}>Song of the Day</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.songInfo}>
              <Text style={styles.songTitle}>Bad Guy</Text>
              <Text style={styles.artistName}>Billie Eilish</Text>
            </View>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => router.push('/screens/song')}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Movie Clip of the Day */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🎬</Text>
            <Text style={styles.cardTitle}>Movie Clip of the Day</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>▶ Friends</Text>
            </View>
            <TouchableOpacity 
              style={styles.watchButton}
              onPress={() => router.push('/screens/movie-clip')}
            >
              <Text style={styles.buttonText}>Watch</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Journal */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📝</Text>
            <Text style={styles.cardTitle}>Daily Journal</Text>
          </View>
          <Text style={styles.journalDescription}>Write about your day in English!</Text>
          <TouchableOpacity 
            style={styles.writeButton}
            onPress={() => router.push('/screens/daily-journal')}
          >
            <Text style={styles.buttonText}>Write</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    color: '#666',
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  startButton: {
    backgroundColor: '#8BC34A',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  watchButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  journalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  writeButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

