import { type ReactNode } from 'react';
import { app, labels } from '@/config';
import { focusRing } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';
import { AppHeader, type NavItem } from './AppHeader';
import { Container } from './Container';

export interface AppShellProps {
  children: ReactNode;
  navItems?: NavItem[];
  /** Header actions rendered before the theme toggle. */
  headerActions?: ReactNode;
  /** Replace the default footer; pass `null` to omit it. */
  footer?: ReactNode;
}

const MAIN_ID = 'main-content';

/**
 * The application frame: a skip link, the sticky header, a centred main region,
 * and a footer. Pages render their content as children inside the shared
 * `Container` gutters. Uses `min-h-dvh` so short pages still fill the viewport.
 */
export function AppShell({ children, navItems, headerActions, footer }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href={`#${MAIN_ID}`}
        className={cn(
          'sr-only z-modal rounded-md bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-md',
          'focus:not-sr-only focus:fixed focus:left-4 focus:top-4',
          focusRing,
        )}
      >
        {labels.a11y.skipToContent}
      </a>

      <AppHeader navItems={navItems} actions={headerActions} />

      <main id={MAIN_ID} className="flex-1 py-6 sm:py-8">
        <Container>{children}</Container>
      </main>

      {footer === undefined ? (
        <footer className="border-t border-border py-6">
          <Container>
            <p className="text-center text-sm text-muted">
              {app.name} — {app.shortName} workspace
            </p>
          </Container>
        </footer>
      ) : (
        footer
      )}
    </div>
  );
}
