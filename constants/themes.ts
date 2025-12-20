export const lightTheme = {
  // Background Colors
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  
  // Text Colors
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  
  // Brand Colors
  primary: '#6C63FF',
  accent: '#FF6B9D',
  success: '#4CAF50',
  danger: '#FF5252',
  warning: '#FFC107',
  
  // UI Colors
  border: '#E5E7EB',
  shadow: '#000000',
  lightGray: '#F3F4F6',
  
  // Status Bar
  statusBarStyle: 'dark' as const,
};

export const darkTheme = {
  // Background Colors
  background: '#121212',
  cardBackground: '#1E1E1E',
  
  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  
  // Brand Colors
  primary: '#8B82FF',
  accent: '#FF8AB8',
  success: '#66BB6A',
  danger: '#FF6B6B',
  warning: '#FFD54F',
  
  // UI Colors
  border: '#2C2C2C',
  shadow: '#000000',
  lightGray: '#2A2A2A',
  
  // Status Bar
  statusBarStyle: 'light' as const,
};

export type Theme = typeof lightTheme;

