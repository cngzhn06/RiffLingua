import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/ThemeContext';
import { fetchSongWithLyrics } from '@/services/lyricsService';

const ONBOARDING_STORAGE_KEY = '@rifflingua_onboarding_completed';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, themeMode, toggleTheme } = useTheme();
  const [testingLyrics, setTestingLyrics] = useState(false);

  const handleTestLyrics = async () => {
    setTestingLyrics(true);
    try {
      // Test şarkısı: Yesterday - The Beatles
      const result = await fetchSongWithLyrics('Yesterday', 'The Beatles');
      
      Alert.alert(
        '✅ Başarılı!',
        `Şarkı: ${result.title}\nSanatçı: ${result.artist}\n\nŞarkı sözleri başarıyla çekildi!\n\n${result.lyrics.substring(0, 150)}...`,
        [{ text: 'Tamam' }]
      );
    } catch (error: any) {
      Alert.alert(
        '❌ Hata',
        `Şarkı sözleri çekilemedi: ${error.message || 'Bilinmeyen hata'}`,
        [{ text: 'Tamam' }]
      );
    } finally {
      setTestingLyrics(false);
    }
  };

  const handleResetOnboarding = async () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show the onboarding screens again when you restart the app. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
              Alert.alert('Success', 'Onboarding reset! Restart the app to see it again.');
            } catch (error) {
              console.error('Failed to reset onboarding:', error);
              Alert.alert('Error', 'Failed to reset onboarding.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Appearance</Text>
          
          <View style={[styles.settingCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>
                  {themeMode === 'dark' ? '🌙' : '☀️'} Dark Mode
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Switch between light and dark theme
                </Text>
              </View>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.lightGray, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>App</Text>
          
          <View style={[styles.settingCard, { backgroundColor: theme.cardBackground }]}>
            <TouchableOpacity style={styles.settingRow} onPress={handleResetOnboarding}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>
                  🔄 Reset Onboarding
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Show welcome screens again
                </Text>
              </View>
              <Text style={[styles.arrow, { color: theme.textSecondary }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Debug Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Debug</Text>
          
          <View style={[styles.settingCard, { backgroundColor: theme.cardBackground }]}>
            <TouchableOpacity 
              style={styles.settingRow} 
              onPress={() => router.push('/debug-database' as any)}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>
                  🔍 View Database
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Check all journal entries
                </Text>
              </View>
              <Text style={[styles.arrow, { color: theme.textSecondary }]}>→</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.lightGray }]} />

            <TouchableOpacity 
              style={styles.settingRow} 
              onPress={handleTestLyrics}
              disabled={testingLyrics}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>
                  🎵 Test Lyrics API
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Test Genius API connection
                </Text>
              </View>
              {testingLyrics ? (
                <ActivityIndicator color={theme.primary} />
              ) : (
                <Text style={[styles.arrow, { color: theme.textSecondary }]}>→</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>About</Text>
          
          <View style={[styles.settingCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>
                  Version
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  1.0.0
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Made with ❤️ for language learners - by zignechan
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  settingCard: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

