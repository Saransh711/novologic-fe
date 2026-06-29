'use client';

import { useAuth } from '@/features/auth';
import type { UserInfo } from './types';

const NOT_PROVIDED = '—';

export interface UseUserInfoResult {
  data: UserInfo | null | undefined;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

/**
 * Adapts the authenticated session (from `AuthProvider`) to the `UserInfo`
 * shape consumed by the user panel. Replaces the previous mock implementation.
 */
export function useUserInfo(): UseUserInfoResult {
  const { user, loading, refetch } = useAuth();

  const data: UserInfo | null | undefined = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address ?? NOT_PROVIDED,
        phone: user.phone ?? NOT_PROVIDED,
      }
    : loading
      ? undefined
      : null;

  return {
    data,
    loading,
    error: undefined,
    refetch: () => void refetch(),
  };
}
