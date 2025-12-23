import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type TabType = 'lyrics' | 'vocabulary' | 'translation';

interface Tab {
  key: TabType;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { key: 'lyrics', label: 'Lyrics', icon: '📝' },
  { key: 'vocabulary', label: 'Vocabulary', icon: '📚' },
  { key: 'translation', label: 'Translation', icon: '🌐' },
];

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  theme: any;
}

/**
 * Sekme navigasyonu komponenti
 */
export function TabBar({ activeTab, onTabChange, theme }: TabBarProps) {
  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && [styles.activeTab, { borderBottomColor: theme.primary }],
          ]}
          onPress={() => onTabChange(tab.key)}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === tab.key ? theme.primary : theme.textSecondary },
            ]}
          >
            {tab.icon} {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

