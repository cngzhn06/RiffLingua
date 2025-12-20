import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import StarRating from '@/components/StarRating';
import { Colors } from '@/constants/colors';

export default function WriteDayScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    // TODO: Save journal entry
    console.log({ content, rating, location, note });
    router.back();
  };

  const handleAddImage = () => {
    // TODO: Image picker
    console.log('Add image');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Content Input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>What happened today?</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Write about your day..."
              placeholderTextColor={Colors.textLight}
              multiline
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
            />
          </View>

          {/* Rating Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>How was your day?</Text>
            <View style={styles.ratingContainer}>
              <StarRating 
                rating={rating} 
                onRatingChange={setRating}
                size="large"
              />
              {rating > 0 && (
                <Text style={styles.ratingText}>
                  {rating === 5 ? 'Amazing!' : 
                   rating === 4 ? 'Great!' : 
                   rating === 3 ? 'Good' : 
                   rating === 2 ? 'Okay' : 'Not great'}
                </Text>
              )}
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📍 Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Where were you?"
              placeholderTextColor={Colors.textLight}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Quick Note Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>💭 Quick Note</Text>
            <TextInput
              style={styles.input}
              placeholder="One sentence summary..."
              placeholderTextColor={Colors.textLight}
              value={note}
              onChangeText={setNote}
              maxLength={100}
            />
            <Text style={styles.charCount}>{note.length}/100</Text>
          </View>

          {/* Add Image Button */}
          <TouchableOpacity 
            style={styles.imageButton}
            onPress={handleAddImage}
          >
            <Text style={styles.imageButtonIcon}>📷</Text>
            <Text style={styles.imageButtonText}>Add Photos</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* Save Button - Fixed at bottom */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.saveButton, !content && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!content}
          >
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  contentInput: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    minHeight: 200,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  ratingContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
  imageButton: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    borderStyle: 'dashed',
  },
  imageButtonIcon: {
    fontSize: 24,
  },
  imageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryLight,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

