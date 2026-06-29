import { Suspense } from 'react';
import type { Metadata } from 'next';
import { labels } from '@/config';
import { LoginView } from '@/features/auth';

export const metadata: Metadata = { title: labels.auth.signIn };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
