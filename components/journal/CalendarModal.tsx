import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Colors } from '@/constants/colors';

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  selectedDate?: string;
}

export default function CalendarModal({ visible, onClose, onSelectDate, selectedDate }: CalendarModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date: Date) => {
    onSelectDate(formatDateString(date));
    onClose();
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
              <Text style={styles.navButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.monthYear}>{monthYear}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
              <Text style={styles.navButtonText}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {weekDays.map((day) => (
              <Text key={day} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          <ScrollView style={styles.daysContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.daysGrid}>
              {days.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    !day && styles.emptyCell,
                    day && selectedDate === formatDateString(day) && styles.selectedDay,
                  ]}
                  onPress={() => day && handleDateSelect(day)}
                  disabled={!day}
                  activeOpacity={0.7}
                >
                  {day && (
                    <Text style={[
                      styles.dayText,
                      selectedDate === formatDateString(day) && styles.selectedDayText,
                    ]}>
                      {day.getDate()}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primaryLight + '20',
  },
  weekDay: {
    width: 40,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  daysContainer: {
    maxHeight: 320,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedDay: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  selectedDayText: {
    color: Colors.surface,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
