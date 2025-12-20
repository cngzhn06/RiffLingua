import { getAllJournals } from '@/services/database';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

// DEBUG SCREEN - Veritabanındaki tüm günlükleri göster
export default function DebugDatabaseScreen() {
  const [journals, setJournals] = useState<any[]>([]);

  useEffect(() => {
    loadAllJournals();
  }, []);

  const loadAllJournals = async () => {
    try {
      const data = await getAllJournals();
      console.log('📚 ALL JOURNALS IN DATABASE:', JSON.stringify(data, null, 2));
      setJournals(data);
    } catch (error) {
      console.error('Error loading journals:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>📚 Database Debug</Text>
        <Text style={styles.subtitle}>Total Journals: {journals.length}</Text>
        
        {journals.map((journal, index) => (
          <View key={journal.id} style={styles.card}>
            <Text style={styles.index}>#{index + 1}</Text>
            <Text style={styles.label}>ID: <Text style={styles.value}>{journal.id}</Text></Text>
            <Text style={styles.label}>Date: <Text style={styles.value}>{journal.date}</Text></Text>
            <Text style={styles.label}>Title: <Text style={styles.value}>{journal.title}</Text></Text>
            <Text style={styles.label}>Rating: <Text style={styles.value}>{journal.rating}</Text></Text>
            <Text style={styles.label}>Mood: <Text style={styles.value}>{journal.mood}</Text></Text>
            <Text style={styles.label}>Note: <Text style={styles.value}>{journal.note || 'N/A'}</Text></Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  index: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    fontWeight: 'normal',
    color: '#666',
  },
});

