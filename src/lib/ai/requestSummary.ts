/**
 * MOCKED AI summary endpoint.
 *
 * The frozen GraphQL contract does not (yet) expose a summarisation operation,
 * so this stands in for a future `POST /ai/summary` call. It resolves with a
 * fixed summary after a simulated round-trip, mirroring the shape a real client
 * would return. When the backend ships the endpoint, swap the body for a real
 * `fetch` and every caller — including its loading/error handling — keeps
 * working unchanged.
 */

/** Result of a successful summary request. */
export interface SummaryResult {
  /** The generated summary text, ready to render into the workbook. */
  summary: string;
}

/** Simulated network latency so the generating state is exercised in the UI. */
const SIMULATED_LATENCY_MS = 900;

/**
 * The canned summary returned by the mock. This is endpoint output (mock data),
 * not user-facing chrome, so it lives with the mock rather than in `src/config`.
 */
const MOCK_SUMMARY = 'This document summarizes the uploaded content.';

/**
 * Requests an AI-generated summary of a workbook. Rejects with the abort reason
 * if `signal` fires before the (simulated) response arrives.
 */
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
