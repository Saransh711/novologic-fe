'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { labels } from '@/config';
import { Button } from '@/components/ui';
import { useAuth } from './AuthProvider';

export function SignOutButton() {
  const { logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function handleClick() {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => void handleClick()}
      isLoading={signingOut}
      leadingIcon={<LogOut className="h-4 w-4" aria-hidden />}
    >
      {labels.auth.signOut}
    </Button>
  );
}
