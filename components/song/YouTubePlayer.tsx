import React from 'react';
import { View, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface YouTubePlayerProps {
  videoId: string;
  playing: boolean;
  onStateChange: (state: string) => void;
}

/**
 * YouTube video oynatıcı komponenti
 */
export function YouTubePlayerComponent({ videoId, playing, onStateChange }: YouTubePlayerProps) {
  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={220}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
  },
});

