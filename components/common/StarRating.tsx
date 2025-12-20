import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 'medium' 
}: StarRatingProps) {
  const sizes = {
    small: 16,
    medium: 24,
    large: 32,
  };

  const fontSize = sizes[size];

  const renderStar = (index: number) => {
    const isFilled = index < rating;
    const star = isFilled ? '⭐' : '☆';

    if (readonly) {
      return (
        <Text key={index} style={[styles.star, { fontSize }]}>
          {star}
        </Text>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        onPress={() => onRatingChange?.(index + 1)}
        hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
      >
        <Text style={[styles.star, { fontSize }]}>{star}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map(renderStar)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    color: '#FFD700',
  },
});

