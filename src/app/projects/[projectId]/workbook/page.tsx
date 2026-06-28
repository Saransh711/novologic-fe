import type { Metadata } from 'next';
import { labels } from '@/config';
// Imported from the module directly (not the feature barrel) so the barrel's
// static editor re-exports — which pull Tiptap's browser-only code — stay out of
// this server component's module graph. The editor itself loads client-side.
import { WorkbookView } from '@/features/workbook/WorkbookView';

export const metadata: Metadata = { title: labels.nav.workbook };

export default async function WorkbookPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <WorkbookView projectId={projectId} />;
}
