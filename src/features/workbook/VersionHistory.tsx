'use client';

import { useCallback, useState } from 'react';
import { AlertCircle, History, RotateCcw } from 'lucide-react';
import { labels } from '@/config';
import {
  useRestoreWorkbookVersionMutation,
  useWorkbookVersionsQuery,
  type WorkbookVersionFieldsFragment,
} from '@/lib/graphql';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  useToast,
} from '@/components/ui';
import { formatDateTime } from '@/lib/utils/formatDate';

export interface VersionHistoryProps {
  workbookId: string | null;
}

const SKELETON_COUNT = 3;

export function VersionHistory({ workbookId }: VersionHistoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          disabled={!workbookId}
          leadingIcon={<History className="h-4 w-4" aria-hidden />}
        >
          {labels.workbook.versions.open}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" aria-label={labels.workbook.versions.title}>
        <SheetHeader>
          <SheetTitle>{labels.workbook.versions.title}</SheetTitle>
          <SheetDescription>{labels.workbook.versions.description}</SheetDescription>
        </SheetHeader>
        {workbookId ? (
          <VersionList workbookId={workbookId} open={open} onRestored={() => setOpen(false)} />
        ) : (
          <p className="text-sm text-muted">{labels.workbook.versions.unavailable}</p>
        )}
      </SheetContent>
    </Sheet>
  );
}

interface VersionListProps {
  workbookId: string;
  open: boolean;
  onRestored: () => void;
}

function VersionList({ workbookId, open, onRestored }: VersionListProps) {
  const { toast } = useToast();
  const { data, loading, error, refetch } = useWorkbookVersionsQuery({
    variables: { workbookId },
    skip: !open,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });
  const [restoreVersion] = useRestoreWorkbookVersionMutation();
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const versions = data?.workbookVersions ?? [];

  const handleRestore = useCallback(
    async (versionId: string) => {
      setRestoringId(versionId);
      try {
        await restoreVersion({ variables: { versionId } });
        void refetch();
        toast({
          variant: 'success',
          title: labels.workbook.versions.restoredTitle,
          description: labels.workbook.versions.restoredBody,
        });
        onRestored();
      } catch {
        toast({
          variant: 'danger',
          title: labels.workbook.versions.restoreErrorTitle,
          description: labels.workbook.versions.restoreErrorBody,
        });
      } finally {
        setRestoringId(null);
      }
    },
    [onRestored, refetch, restoreVersion, toast],
  );

  if (loading && versions.length === 0) {
    return (
      <ul className="flex flex-col gap-3" aria-hidden>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <li key={index} className="rounded-lg border border-border p-4">
            <Skeleton className="h-4 w-40 max-w-full" />
            <Skeleton className="mt-3 h-8 w-24" />
          </li>
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="border-danger/30 bg-danger/5 flex flex-col items-start gap-3 rounded-lg border p-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
          <div>
            <p className="text-sm font-medium text-foreground">
              {labels.workbook.versions.errorTitle}
            </p>
            <p className="text-sm text-muted">{labels.states.genericError}</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => void refetch()}>
          {labels.actions.retry}
        </Button>
      </div>
    );
  }

  if (versions.length === 0) {
    return <p className="text-sm text-muted">{labels.workbook.versions.empty}</p>;
  }

  return (
    <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto" aria-label={labels.a11y.versionList}>
      {versions.map((version, index) => (
        <VersionRow
          key={version.id}
          version={version}
          position={versions.length - index}
          isRestoring={restoringId === version.id}
          disabled={restoringId !== null}
          onRestore={() => void handleRestore(version.id)}
        />
      ))}
    </ul>
  );
}

interface VersionRowProps {
  version: WorkbookVersionFieldsFragment;
  position: number;
  isRestoring: boolean;
  disabled: boolean;
  onRestore: () => void;
}

function VersionRow({ version, position, isRestoring, disabled, onRestore }: VersionRowProps) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">
          {labels.workbook.versions.versionLabel(position)}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted">
          {labels.workbook.versions.savedLabel} {formatDateTime(version.createdAt)}
        </p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        isLoading={isRestoring}
        disabled={disabled && !isRestoring}
        leadingIcon={<RotateCcw className="h-4 w-4" aria-hidden />}
        onClick={onRestore}
        className="shrink-0"
      >
        {isRestoring ? labels.workbook.versions.restoring : labels.workbook.versions.restore}
      </Button>
    </li>
  );
}
