'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { requestSummary } from '@/lib/ai';

export interface UseAiSummaryResult {
  generate: () => Promise<string>;
  isGenerating: boolean;
}

export function useAiSummary(): UseAiSummaryResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const generate = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsGenerating(true);
    try {
      const { summary } = await requestSummary(controller.signal);
      return summary;
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsGenerating(false);
      }
    }
  }, []);

  return { generate, isGenerating };
}
