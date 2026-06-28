'use client';

import Link from 'next/link';
import { AlertCircle, ChevronRight, FolderOpen, NotebookPen } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { labels, routes } from '@/config';
import { fadeInUp, staggerContainer } from '@/design/motion';
import { useProjectsQuery, type ProjectFieldsFragment } from '@/lib/graphql';
import { AppShell, type NavItem } from '@/components/layout';
import { Button, Card, Skeleton } from '@/components/ui';
import { focusRing } from '@/components/ui/styles';
import { formatDate } from '@/lib/utils/formatDate';
import { cn } from '@/lib/utils/cn';

const navItems: NavItem[] = [{ label: labels.nav.projects, href: routes.projects }];

const SKELETON_COUNT = 4;

function ProjectCard({ project }: { project: ProjectFieldsFragment }) {
  return (
    <Link
      href={routes.workbook(project.id)}
      aria-label={labels.projects.openWorkbookFor(project.name)}
      className={cn('group block rounded-xl', focusRing)}
    >
      <Card
        className={cn(
          'flex h-full items-center justify-between gap-4 p-5',
          'transition duration-base ease-standard hover:shadow-md',
          'motion-safe:group-hover:-translate-y-0.5',
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary">
            <NotebookPen className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{project.name}</p>
            <p className="text-sm text-muted">
              {labels.projects.createdLabel} {formatDate(project.createdAt)}
            </p>
          </div>
        </div>
        <ChevronRight
          className="h-5 w-5 shrink-0 text-muted transition-transform duration-base ease-standard motion-safe:group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden
        />
      </Card>
    </Link>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card className="flex items-center gap-3 p-5">
      <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40 max-w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </Card>
  );
}

function ProjectsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="border-danger/30 bg-danger/5 flex flex-col items-start gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
        <div>
          <p className="text-sm font-medium text-foreground">{labels.projects.errorTitle}</p>
          <p className="text-sm text-muted">{labels.states.genericError}</p>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onRetry} className="shrink-0">
        {labels.actions.retry}
      </Button>
    </div>
  );
}

function ProjectsEmpty() {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-muted">
        <FolderOpen className="h-6 w-6" aria-hidden />
      </span>
      <p className="max-w-sm text-sm text-muted">{labels.states.emptyProjects}</p>
    </Card>
  );
}

export function ProjectsView() {
  const { data, loading, error, refetch } = useProjectsQuery();
  const reduceMotion = useReducedMotion();
  const projects = data?.projects ?? [];

  return (
    <AppShell navItems={navItems}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground">
            {labels.projects.title}
          </h1>
          <p className="text-sm text-pretty text-muted">{labels.projects.subtitle}</p>
        </header>

        {loading ? (
          <div className="grid gap-3" aria-hidden>
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <ProjectsError onRetry={() => void refetch()} />
        ) : projects.length === 0 ? (
          <ProjectsEmpty />
        ) : (
          <motion.ul
            className="grid gap-3"
            variants={reduceMotion ? undefined : staggerContainer}
            initial={reduceMotion ? false : 'hidden'}
            animate={reduceMotion ? false : 'visible'}
          >
            {projects.map((project) => (
              <motion.li key={project.id} variants={reduceMotion ? undefined : fadeInUp}>
                <ProjectCard project={project} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </AppShell>
  );
}
