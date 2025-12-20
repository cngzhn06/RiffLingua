import { View, Text, StyleSheet } from 'react-native';

export default function SongScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Song of the Day</Text>
      <Text style={styles.subtitle}>Bad Guy - Billie Eilish</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});

