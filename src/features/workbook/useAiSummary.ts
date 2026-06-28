'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { requestSummary } from '@/lib/ai';

export interface UseAiSummaryResult {
  /** Requests a summary; resolves with the text or rejects on failure. */
  generate: () => Promise<string>;
  /** True while a request is in flight (drives the button's loading state). */
  isGenerating: boolean;
}

/**
 * Thin stateful wrapper around the mocked AI summary endpoint. Tracks the
 * in-flight state for the UI and aborts any pending request on unmount so a
 * resolved promise never updates an unmounted component.
 */
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
