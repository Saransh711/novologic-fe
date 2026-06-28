'use client';

import { useCallback, useEffect, useState } from 'react';
import type { UserInfo } from './types';

/**
 * TEMPORARY mock standing in for a future generated `useUserQuery` hook.
 *
 * The frozen GraphQL contract does not yet expose user data — there is no
 * `user`/`me` query and no email/address/phone fields anywhere in the schema.
 * Until the backend publishes that contract, this hook returns placeholder data
 * in the *exact* result shape an Apollo query hook produces (`data`, `loading`,
 * `error`, `refetch`). When the real query lands, replace the body of this hook
 * with a thin wrapper around the generated hook (mapping `data?.user`) and every
 * consumer — including its loading/error/empty handling — keeps working
 * unchanged.
 */

/** Simulated network latency so the loading skeleton is exercised in dev. */
const SIMULATED_LATENCY_MS = 600;

/**
 * Realistic placeholder matching the seed user in local dev. This is mock data,
 * not user-facing copy, so it lives with the mock rather than in `src/config`.
 */
const PLACEHOLDER_USER: UserInfo = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@workbook.dev',
  address: '123 Market Street, San Francisco, CA 94103',
  phone: '+1 (555) 014-2750',
};

export interface UseUserInfoResult {
  /** The user profile, `null` when none exists (empty state), `undefined` while first loading. */
  data: UserInfo | null | undefined;
  loading: boolean;
  error: Error | undefined;
  /** Re-runs the request; wired to the error state's retry action. */
  refetch: () => void;
}

export function useUserInfo(): UseUserInfoResult {
  const [data, setData] = useState<UserInfo | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  // Bumping this re-runs the fetch effect; `refetch` drives it from event handlers.
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;
      setData(PLACEHOLDER_USER);
      setLoading(false);
    }, SIMULATED_LATENCY_MS);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [reloadKey]);

  const refetch = useCallback(() => {
    setData(undefined);
    setError(undefined);
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  return { data, loading, error, refetch };
}
