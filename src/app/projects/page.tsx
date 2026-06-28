import type { Metadata } from 'next';
import { labels } from '@/config';
import { ProjectsView } from '@/features/projects';

export const metadata: Metadata = { title: labels.nav.projects };

export default function ProjectsPage() {
  return <ProjectsView />;
}
