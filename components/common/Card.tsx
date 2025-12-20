import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export default function Card({ children, style, padding = 20 }: CardProps) {
  const { theme } = useTheme();
  
  return (
    <View style={[
      styles.card, 
      { 
        padding,
        backgroundColor: theme.cardBackground,
        shadowColor: theme.shadow,
        borderColor: theme.primary + '20',
      }, 
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
  },
});

