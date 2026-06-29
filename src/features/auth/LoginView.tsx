'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, NotebookPen } from 'lucide-react';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { app, labels, routes } from '@/config';
import { useLoginMutation } from '@/lib/graphql';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  ThemeToggle,
  useToast,
} from '@/components/ui';
import { useAuth } from './AuthProvider';

function resolveErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const unauth = error.errors.find((e) => e.extensions?.code === 'UNAUTHENTICATED');
    if (unauth) return labels.auth.invalidCredentials;
  }
  return labels.auth.genericError;
}

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, loading: sessionLoading, refetch } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading: submitting }] = useLoginMutation();

  const redirectTo = searchParams.get('redirect') ?? routes.projects;
  const safeRedirect = redirectTo.startsWith('/') ? redirectTo : routes.projects;

  // If a valid session is already present (e.g. a silent refresh restored it),
  // don't make the user sign in again.
  useEffect(() => {
    if (!sessionLoading && user) {
      router.replace(safeRedirect);
    }
  }, [router, safeRedirect, sessionLoading, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await login({ variables: { input: { email, password } } });
      await refetch();
      router.replace(safeRedirect);
    } catch (error) {
      toast({
        variant: 'danger',
        title: labels.auth.errorTitle,
        description: resolveErrorMessage(error),
      });
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="flex items-center justify-between px-6 py-5 sm:px-8">
        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
          <NotebookPen className="h-5 w-5 text-primary" aria-hidden />
          {app.name}
        </span>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{labels.auth.title}</CardTitle>
            <CardDescription>{labels.auth.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  {labels.auth.emailLabel}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={labels.auth.emailPlaceholder}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  {labels.auth.passwordLabel}
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={labels.auth.passwordPlaceholder}
                  disabled={submitting}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={submitting}
                leadingIcon={<LogIn className="h-4 w-4" aria-hidden />}
              >
                {submitting ? labels.auth.signingIn : labels.auth.submit}
              </Button>

              <p className="text-center text-xs text-muted">{labels.auth.demoHint}</p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
