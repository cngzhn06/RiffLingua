import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/colors';

interface ActivityCardProps {
  icon: string;
  label: string;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

export default function ActivityCard({ 
  icon, 
  label, 
  title, 
  subtitle, 
  color,
  onPress 
}: ActivityCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  iconContainer: {
    marginBottom: 12,
  },
  icon: {
    fontSize: 56,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginBottom: 8,
    opacity: 0.9,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: 4,
  },
  subtitle: {
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
});

