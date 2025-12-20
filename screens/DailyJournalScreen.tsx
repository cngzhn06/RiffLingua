import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { mockJournals } from '@/data/mockJournals';
import JournalCard from '@/components/JournalCard';
import CalendarModal from '@/components/CalendarModal';
import { Colors } from '@/constants/colors';

export default function DailyJournalScreen() {
  const router = useRouter();
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handleCardPress = (date: string) => {
    router.push(`/screens/single-day-journal?date=${date}`);
  };

  const handleDateSelect = (date: string) => {
    router.push(`/screens/single-day-journal?date=${date}`);
  };

  const handleWriteNew = () => {
    router.push('/screens/write-day');
  };

  const formatMonthYear = () => {
    return selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Calendar Header - Fixed */}
        <View style={styles.calendarHeader}>
          <View style={styles.monthSelector}>
            <TouchableOpacity 
              style={styles.monthButton}
              onPress={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
            >
              <Text style={styles.monthButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>{formatMonthYear()}</Text>
            <TouchableOpacity 
              style={styles.monthButton}
              onPress={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
            >
              <Text style={styles.monthButtonText}>→</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.calendarIconButton}
            onPress={() => setCalendarVisible(true)}
          >
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        {/* Journal List */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {mockJournals.map((entry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onPress={() => handleCardPress(entry.date)}
            />
          ))}
        </ScrollView>

        {/* Floating Write Button */}
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={handleWriteNew}
        >
          <Text style={styles.floatingButtonIcon}>✏️</Text>
        </TouchableOpacity>

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
  calendarHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  monthButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthButtonText: {
    fontSize: 20,
    color: Colors.surface,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.surface,
    minWidth: 150,
    textAlign: 'center',
  },
  calendarIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  calendarIcon: {
    fontSize: 22,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonIcon: {
    fontSize: 28,
  },
});
