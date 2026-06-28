export interface SummaryResult {
  summary: string;
}

const SIMULATED_LATENCY_MS = 900;

const MOCK_SUMMARY = 'This document summarizes the uploaded content.';

export function requestSummary(signal?: AbortSignal): Promise<SummaryResult> {
  return new Promise<SummaryResult>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Summary request aborted.', 'AbortError'));
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve({ summary: MOCK_SUMMARY });
    }, SIMULATED_LATENCY_MS);

    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('Summary request aborted.', 'AbortError'));
    };

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
