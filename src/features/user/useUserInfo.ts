'use client';

import { useCallback, useEffect, useState } from 'react';
import type { UserInfo } from './types';


const SIMULATED_LATENCY_MS = 600;

const PLACEHOLDER_USER: UserInfo = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@workbook.dev',
  address: '123 Market Street, San Francisco, CA 94103',
  phone: '+1 (555) 014-2750',
};

export interface UseUserInfoResult {
  data: UserInfo | null | undefined;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

export function useUserInfo(): UseUserInfoResult {
  const [data, setData] = useState<UserInfo | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
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
