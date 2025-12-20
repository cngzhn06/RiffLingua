import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import StarRating from '@/components/common/StarRating';
import MoodPicker from '@/components/journal/MoodPicker';
import { createJournal, updateJournal } from '@/services/database';
import { useTheme } from '@/contexts/ThemeContext';

export default function WriteDayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  
  // Edit mode kontrolü
  const isEditMode = params.editMode === 'true';
  const entryId = params.entryId as string;
  
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('');
  const [saving, setSaving] = useState(false);

  // Edit mode'da default değerleri yükle
  useEffect(() => {
    if (isEditMode) {
      setContent(params.content as string || '');
      setRating(parseInt(params.rating as string) || 0);
      setLocation(params.location as string || '');
      setNote(params.note as string || '');
      setMood(params.mood as string || '');
    }
  }, [isEditMode]);

  const handleClear = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to clear all fields?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setContent('');
            setRating(0);
            setLocation('');
            setNote('');
            setMood('');
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Oops!', 'Please write something about your day 📝');
      return;
    }

    if (rating === 0) {
      Alert.alert('Wait!', 'How was your day? Rate it with stars ⭐');
      return;
    }

    try {
      setSaving(true);
      
      // Başlık oluştur (ilk 50 karakter)
      const title = content.trim().substring(0, 50) + (content.length > 50 ? '...' : '');
      
      if (isEditMode && entryId) {
        // Edit mode - güncelle
        await updateJournal(entryId, {
          title,
          content: content.trim(),
          rating,
          mood: mood || undefined,
          location: location.trim() || undefined,
          note: note.trim() || undefined,
        });
        
        Alert.alert('Updated! ✨', 'Your journal entry has been updated', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        // Create mode - yeni oluştur
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        await createJournal({
          date: dateString,
          title,
          content: content.trim(),
          rating,
          mood: mood || undefined,
          location: location.trim() || undefined,
          note: note.trim() || undefined,
        });
        
        Alert.alert('Success! 🎉', 'Your journal entry has been saved', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error('Error saving journal:', error);
      Alert.alert('Error', 'Failed to save your entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = () => {
    // TODO: Image picker
    console.log('Add image');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Content Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>What happened today?</Text>
            <TextInput
              style={[styles.contentInput, { 
                backgroundColor: theme.cardBackground,
                color: theme.textPrimary,
                borderColor: theme.primary + '40',
              }]}
              placeholder="Write about your day..."
              placeholderTextColor={theme.textSecondary}
              multiline
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
              returnKeyType="default"
              blurOnSubmit={false}
            />
          </View>

          {/* Mood Picker */}
          <View style={styles.section}>
            <MoodPicker selectedMood={mood} onSelectMood={setMood} />
          </View>

          {/* Rating Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>How was your day?</Text>
            <View style={[styles.ratingContainer, { 
              backgroundColor: theme.cardBackground,
              borderColor: theme.primary + '40',
            }]}>
              <StarRating 
                rating={rating} 
                onRatingChange={setRating}
                size="large"
              />
              {rating > 0 && (
                <Text style={[styles.ratingText, { color: theme.primary }]}>
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
            <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>📍 Location</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.cardBackground,
                color: theme.textPrimary,
                borderColor: theme.primary + '40',
              }]}
              placeholder="Where were you?"
              placeholderTextColor={theme.textSecondary}
              value={location}
              onChangeText={setLocation}
              returnKeyType="done"
            />
          </View>

          {/* Quick Note Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>💭 Quick Note</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.cardBackground,
                color: theme.textPrimary,
                borderColor: theme.primary + '40',
              }]}
              placeholder="One sentence summary..."
              placeholderTextColor={theme.textSecondary}
              value={note}
              onChangeText={setNote}
              maxLength={100}
              returnKeyType="done"
            />
            <Text style={[styles.charCount, { color: theme.textSecondary }]}>{note.length}/100</Text>
          </View>

          {/* Add Image Button */}
          <TouchableOpacity 
            style={[styles.imageButton, {
              backgroundColor: theme.cardBackground,
              borderColor: theme.primary + '40',
            }]}
            onPress={handleAddImage}
          >
            <Text style={styles.imageButtonIcon}>📷</Text>
            <Text style={[styles.imageButtonText, { color: theme.primary }]}>Add Photos</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* Buttons - Fixed at bottom */}
        <View style={[styles.footer, {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        }]}>
          <TouchableOpacity 
            style={[styles.clearButton, {
              backgroundColor: theme.cardBackground,
              borderColor: theme.danger,
            }]}
            onPress={handleClear}
          >
            <Text style={[styles.clearButtonText, { color: theme.danger }]}>Clear All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.saveButton,
              { backgroundColor: theme.primary },
              (!content || rating === 0 || saving) && [styles.saveButtonDisabled, { backgroundColor: theme.lightGray }]
            ]}
            onPress={handleSave}
            disabled={!content || rating === 0 || saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : isEditMode ? 'Update Entry' : 'Save Entry'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  contentInput: {
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
  },
  ratingContainer: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  imageButton: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  imageButtonIcon: {
    fontSize: 24,
  },
  imageButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 2,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

