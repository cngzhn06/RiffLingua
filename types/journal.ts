export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  title: string;
  content: string;
  images?: string[];
  mood?: string;
  steps?: number;
  location?: string;
  rating?: number; // 1-5 yıldız
}

