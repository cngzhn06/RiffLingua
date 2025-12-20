import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { getAllJournals, initDatabase, deleteJournal } from '@/services/database';
import { JournalEntry } from '@/types/journal';
import JournalCard from '@/components/journal/JournalCard';
import CalendarModal from '@/components/journal/CalendarModal';
import JournalHeader from '@/components/journal/JournalHeader';
import FloatingWriteButton from '@/components/journal/FloatingWriteButton';
import EmptyState from '@/components/journal/EmptyState';
import { Colors } from '@/constants/colors';

export default function DailyJournalScreen() {
  const router = useRouter();
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Sayfa her göründüğünde yeniden yükle
  useFocusEffect(
    useCallback(() => {
      loadJournals();
    }, [])
  );

  const loadJournals = async () => {
    try {
      await initDatabase();
      const data = await getAllJournals();
      setJournals(data);
    } catch (error) {
      console.error('Error loading journals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Seçili aya göre filtrele
  const getFilteredJournals = () => {
    return journals.filter(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getMonth() === selectedMonth.getMonth() &&
        entryDate.getFullYear() === selectedMonth.getFullYear()
      );
    });
  };

  const filteredJournals = getFilteredJournals();

  const handleCardPress = (date: string) => {
    router.push(`/screens/single-day-journal?date=${date}`);
  };

  const handleDateSelect = (date: string) => {
    router.push(`/screens/single-day-journal?date=${date}`);
  };

  const handleWriteNew = () => {
    router.push('/screens/write-day');
  };

  const handleDelete = async (entryId: string) => {
    try {
      await deleteJournal(entryId);
      await loadJournals(); // Listeyi yenile
    } catch (error) {
      console.error('Error deleting journal:', error);
      Alert.alert('Error', 'Failed to delete entry. Please try again.');
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    router.push({
      pathname: '/screens/write-day',
      params: {
        editMode: 'true',
        entryId: entry.id,
        date: entry.date,
        title: entry.title,
        content: entry.content,
        rating: entry.rating?.toString() || '0',
        mood: entry.mood || '',
        location: entry.location || '',
        note: entry.note || '',
      }
    });
  };

  const formatMonthYear = () => {
    return selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1);
    setSelectedMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1);
    setSelectedMonth(newMonth);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Calendar Header */}
        <JournalHeader
          month={formatMonthYear()}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onCalendarPress={() => setCalendarVisible(true)}
        />

        {/* Journal List */}
        {filteredJournals.length === 0 ? (
          <EmptyState month={formatMonthYear()} />
        ) : (
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {filteredJournals.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onPress={() => handleCardPress(entry.date)}
                onDelete={() => handleDelete(entry.id)}
                onEdit={() => handleEdit(entry)}
              />
            ))}
          </ScrollView>
        )}

        {/* Floating Write Button */}
        <FloatingWriteButton onPress={handleWriteNew} />

        {/* Calendar Modal */}
        <CalendarModal
          visible={calendarVisible}
          onClose={() => setCalendarVisible(false)}
          onSelectDate={handleDateSelect}
        />
      </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
});
