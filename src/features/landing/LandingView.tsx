'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { FileUp, History, LogIn, NotebookPen, Save } from 'lucide-react';
import { app, editor, labels, routes, upload } from '@/config';
import { fadeInUp, staggerContainer } from '@/design/motion';
import { Button, Card, CardDescription, CardHeader, CardTitle, ThemeToggle } from '@/components/ui';
import { SignOutButton, useAuth } from '@/features/auth';
import { UserInfoPanel } from '@/features/user';

const features = [
  {
    icon: Save,
    title: 'Effortless autosave',
    description: `Your work is saved automatically as you type — no save button, no lost ideas.`,
  },
  {
    icon: History,
    title: 'Version history',
    description: `Every save keeps your last ${editor.maxVersions} snapshots so you can step back anytime.`,
  },
  {
    icon: FileUp,
    title: 'Rich attachments',
    description: `Drop in images and PDFs up to ${upload.maxSizeLabel} right inside your workbook.`,
  },
] as const;

export function LandingView() {
  const router = useRouter();
  const { user, loading } = useAuth();

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-6 py-8 sm:px-8">
      <header className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
          <NotebookPen className="h-5 w-5 text-primary" aria-hidden />
          {app.name}
        </span>
        <div className="flex items-center gap-2">
          {!loading && !user ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(routes.login)}
              leadingIcon={<LogIn className="h-4 w-4" aria-hidden />}
            >
              {labels.auth.signIn}
            </Button>
          ) : null}
          {!loading && user ? <SignOutButton /> : null}
          <ThemeToggle />
        </div>
      </header>

      <UserInfoPanel className="mt-6" />

      <motion.main
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col items-center justify-center py-16 text-center"
      >
        <motion.h1
          variants={fadeInUp}
          className="max-w-2xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl"
        >
          {app.tagline}
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-4 max-w-xl text-pretty text-lg text-muted">
          {app.description}
        </motion.p>
        <motion.div
          variants={fadeInUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" onClick={() => router.push(routes.projects)}>
            {labels.actions.openWorkbook}
          </Button>
        </motion.div>

        <motion.section
          variants={staggerContainer}
          className="mt-16 grid w-full gap-4 sm:grid-cols-3"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div key={title} variants={fadeInUp} className="h-full">
              <Card className="h-full text-left transition-shadow duration-base ease-standard hover:shadow-md">
                <CardHeader>
                  <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-muted text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.section>
      </motion.main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted">
        {app.name} — {app.shortName} workspace
      </footer>
    </div>
  );
}
