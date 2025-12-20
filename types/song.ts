export interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  thumbnailUrl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lyrics?: string;
  translation?: string;
  vocabularyWords?: VocabularyWord[];
  duration?: string;
  genre?: string;
}

export interface VocabularyWord {
  word: string;
  meaning: string;
  example: string;
  timestamp?: string; // Şarkıdaki zaman damgası
}

export interface UserSongProgress {
  songId: string;
  completed: boolean;
  learnedWords: string[];
  lastAccessedAt: Date;
  rating?: number;
}

