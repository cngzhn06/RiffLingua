import { TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';

interface InputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export default function Input({ containerStyle, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, containerStyle]}
      placeholderTextColor={Colors.textLight}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
});

