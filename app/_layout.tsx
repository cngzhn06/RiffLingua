import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initDatabase } from '@/services/database';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Initialize database on app start
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
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
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
