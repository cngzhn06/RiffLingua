import { useState, useEffect, useCallback } from 'react';
import { translateLyrics } from '@/services/translationService';

interface UseTranslationOptions {
  text: string | undefined;
  targetLang?: string;
  enabled?: boolean;
}

interface UseTranslationReturn {
  translation: string | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Metin çevirisi için custom hook
 * - Metin değiştiğinde otomatik çevirir
 * - Cache kullanır
 * - enabled=false ise çevirmez
 */
export function useTranslation({
  text,
  targetLang = 'tr',
  enabled = true,
}: UseTranslationOptions): UseTranslationReturn {
  const [translation, setTranslation] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTranslation = useCallback(async () => {
    // Text yoksa veya enabled değilse çalışma
    if (!text || !enabled) {
      setTranslation(undefined);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🌐 Çeviri başlatılıyor...');
      const translated = await translateLyrics(text, targetLang);
      setTranslation(translated);
      console.log('✅ Çeviri tamamlandı');
    } catch (err: any) {
      console.error('Çeviri hatası:', err);
      setError(err.message || 'Çeviri yapılamadı');
    } finally {
      setIsLoading(false);
    }
  }, [text, targetLang, enabled]);

  useEffect(() => {
    fetchTranslation();
  }, [fetchTranslation]);

  return {
    translation,
    isLoading,
    error,
    refetch: fetchTranslation,
  };
}

