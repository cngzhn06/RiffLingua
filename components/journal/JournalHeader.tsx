import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';

interface JournalHeaderProps {
  month: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onCalendarPress: () => void;
}

export default function JournalHeader({ 
  month, 
  onPrevMonth, 
  onNextMonth, 
  onCalendarPress 
}: JournalHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.monthSelector}>
        <TouchableOpacity style={styles.monthButton} onPress={onPrevMonth}>
          <Text style={styles.monthButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{month}</Text>
        <TouchableOpacity style={styles.monthButton} onPress={onNextMonth}>
          <Text style={styles.monthButtonText}>→</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.calendarButton} onPress={onCalendarPress}>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
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
  calendarButton: {
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
});

