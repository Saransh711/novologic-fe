import type { Metadata } from 'next';
import { labels } from '@/config';
import { WorkbookView } from '@/features/workbook';

export const metadata: Metadata = { title: labels.nav.workbook };

export default async function WorkbookPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <WorkbookView projectId={projectId} />;
}
