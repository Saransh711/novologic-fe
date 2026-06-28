'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, NotebookPen } from 'lucide-react';
import { app, labels, routes } from '@/config';
import { cn } from '@/lib/utils/cn';
import {
  IconButton,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  ThemeToggle,
} from '@/components/ui';
import { Container } from './Container';

export interface NavItem {
  label: string;
  href: string;
}

export interface AppHeaderProps {
  navItems?: NavItem[];
  /** Actions rendered on the trailing edge, before the theme toggle. */
  actions?: ReactNode;
}

function isActive(pathname: string, href: string): boolean {
  if (href === routes.home) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Brand() {
  return (
    <Link
      href={routes.home}
      aria-label={labels.a11y.home}
      className="inline-flex items-center gap-2 rounded-md font-semibold text-foreground transition-colors duration-fast ease-standard hover:text-primary"
    >
      <NotebookPen className="h-5 w-5 text-primary" aria-hidden />
      <span>{app.shortName}</span>
    </Link>
  );
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-fast ease-standard',
        active ? 'bg-surface-muted text-foreground' : 'text-muted hover:bg-surface-muted hover:text-foreground',
      )}
    >
      {item.label}
    </Link>
  );
}

/**
 * Sticky, responsive top bar. The primary navigation shows inline from the
 * `md` breakpoint up; below that it collapses into a slide-in sheet behind a
 * menu button, keeping comfortable touch targets on small screens.
 */
export function AppHeader({ navItems = [], actions }: AppHeaderProps) {
  const pathname = usePathname();
  const hasNav = navItems.length > 0;

  return (
    <header className="sticky top-0 z-sticky border-b border-border bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-6">
          {hasNav ? (
            <Sheet>
              <SheetTrigger asChild>
                <IconButton aria-label={labels.a11y.openMenu} variant="ghost" className="md:hidden">
                  <Menu aria-hidden />
                </IconButton>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>{labels.a11y.primaryNav}</SheetTitle>
                </SheetHeader>
                <nav aria-label={labels.a11y.primaryNav} className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <NavLink item={item} pathname={pathname} />
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          ) : null}

          <Brand />

          {hasNav ? (
            <nav aria-label={labels.a11y.primaryNav} className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
