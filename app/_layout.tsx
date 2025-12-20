import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { initDatabase } from '@/services/database';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

const ONBOARDING_STORAGE_KEY = '@rifflingua_onboarding_completed';

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { theme, themeMode } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const hasCompletedOnboarding = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      
      // If onboarding not completed and not already on onboarding screen
      if (!hasCompletedOnboarding && segments[0] !== 'onboarding') {
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
    } finally {
      setIsReady(true);
    }
  };

  // Initialize database on app start
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.cardBackground,
          },
          headerTintColor: theme.primary,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="onboarding" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="screens/song" 
          options={{ 
            title: 'Song of the Day',
            headerBackTitle: 'Home'
          }} 
        />
        <Stack.Screen 
          name="screens/movie-clip" 
          options={{ 
            title: 'Movie Clip',
            headerBackTitle: 'Home'
          }} 
        />
        <Stack.Screen 
          name="screens/daily-journal" 
          options={{ 
            title: 'Daily Journal',
            headerBackTitle: 'Home',
            headerLargeTitle: false
          }} 
        />
        <Stack.Screen 
          name="screens/single-day-journal" 
          options={{ 
            title: '',
            headerBackTitle: 'Journal'
          }} 
        />
        <Stack.Screen 
          name="screens/write-day" 
          options={{ 
            title: 'Write Entry',
            headerBackTitle: 'Back',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="screens/settings" 
          options={{ 
            title: 'Settings',
            headerBackTitle: 'Home'
          }} 
        />
      </Stack>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
