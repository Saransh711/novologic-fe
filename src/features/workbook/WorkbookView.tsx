'use client';

import dynamic from 'next/dynamic';
import { AlertCircle } from 'lucide-react';
import type { JSONContent } from '@tiptap/react';
import { labels, routes } from '@/config';
import { useWorkbookQuery } from '@/lib/graphql';
import { AppShell, type NavItem } from '@/components/layout';
import { Button, Skeleton } from '@/components/ui';
import { SaveStatus } from './SaveStatus';
import { useWorkbookAutosave } from './useWorkbookAutosave';

export interface WorkbookViewProps {
  projectId: string;
}

const navItems: NavItem[] = [{ label: labels.nav.projects, href: routes.projects }];

function EditorSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <Skeleton className="h-12 w-full rounded-lg" />
      <div className="space-y-3 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}

/**
 * The Tiptap editor relies on browser APIs and a default React import that
 * breaks server-side module evaluation, so it is loaded client-side only. The
 * skeleton stands in until the editor chunk has hydrated.
 */
const WorkbookEditor = dynamic(() => import('./WorkbookEditor').then((mod) => mod.WorkbookEditor), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="border-danger/30 bg-danger/5 flex flex-col items-start gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
        <div>
          <p className="text-sm font-medium text-foreground">{labels.workbook.loadErrorTitle}</p>
          <p className="text-sm text-muted">{labels.states.genericError}</p>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onRetry} className="shrink-0">
        {labels.actions.retry}
      </Button>
    </div>
  );
}

/**
 * The workbook page surface: loads the project's document, renders the editor,
 * and autosaves edits. Every async state — loading, error, and the empty
 * "no workbook yet" case — is handled explicitly. The autosave indicator lives
 * in the header once the editor is interactive.
 */
export function WorkbookView({ projectId }: WorkbookViewProps) {
  const { data, loading, error, refetch } = useWorkbookQuery({ variables: { projectId } });
  const autosave = useWorkbookAutosave(projectId);

  const ready = !loading && !error;
  const content = (data?.workbook?.content ?? null) as JSONContent | null;

  return (
    <AppShell
      navItems={navItems}
      headerActions={
        ready ? <SaveStatus status={autosave.status} onRetry={autosave.retry} /> : undefined
      }
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {labels.workbook.title}
          </h1>
          <p className="text-sm text-muted">{labels.workbook.subtitle}</p>
        </header>

        {loading ? (
          <EditorSkeleton />
        ) : error ? (
          <LoadError onRetry={() => void refetch().catch(() => {})} />
        ) : (
          <WorkbookEditor content={content} projectId={projectId} onChange={autosave.onChange} />
        )}
      </div>
    </AppShell>
  );
}
