import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';

export default function DailyJournalScreen() {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Journal</Text>
      <Text style={styles.description}>Write about your day in English!</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Start writing..."
        value={text}
        onChangeText={setText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

