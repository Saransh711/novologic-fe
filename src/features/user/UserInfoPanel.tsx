'use client';

import { AlertCircle, Mail, MapPin, Phone, User as UserIcon, type LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { labels } from '@/config';
import { fadeInUp, staggerContainer } from '@/design/motion';
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import type { UserInfo } from './types';
import { useUserInfo } from './useUserInfo';

interface FieldRow {
  icon: LucideIcon;
  label: string;
  value: string;
}

const SKELETON_ROWS = Object.keys(labels.user.fields).length;

function toFieldRows(user: UserInfo): FieldRow[] {
  return [
    { icon: UserIcon, label: labels.user.fields.name, value: user.name },
    { icon: Mail, label: labels.user.fields.email, value: user.email },
    { icon: MapPin, label: labels.user.fields.address, value: user.address },
    { icon: Phone, label: labels.user.fields.phone, value: user.phone },
  ];
}

function FieldIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary">
      <Icon className="h-4 w-4" aria-hidden />
    </span>
  );
}

function Field({ icon, label, value }: FieldRow) {
  return (
    <div className="flex items-start gap-3">
      <FieldIcon icon={icon} />
      <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted">{label}</dt>
        <dd className="mt-0.5 break-words text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-44 max-w-full" />
      </div>
    </div>
  );
}

const fieldGridClass = 'grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2';

export interface UserInfoPanelProps {
  className?: string;
}

export function UserInfoPanel({ className }: UserInfoPanelProps) {
  const { data, loading, error, refetch } = useUserInfo();
  const reduceMotion = useReducedMotion();

  return (
    <Card className={cn('w-full', className)} aria-busy={loading || undefined}>
      <CardHeader>
        <CardTitle>{labels.user.panelTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className={fieldGridClass}>
            <span className="sr-only" role="status">
              {labels.states.loading}
            </span>
            {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <FieldSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="border-danger/30 bg-danger/5 flex flex-col items-start gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
              <div>
                <p className="text-sm font-medium text-foreground">{labels.user.errorTitle}</p>
                <p className="text-sm text-muted">{labels.states.genericError}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={refetch} className="shrink-0">
              {labels.actions.retry}
            </Button>
          </div>
        ) : !data ? (
          <p className="text-sm text-muted">{labels.user.empty}</p>
        ) : (
          <motion.dl
            className={fieldGridClass}
            variants={reduceMotion ? undefined : staggerContainer}
            initial={reduceMotion ? false : 'hidden'}
            animate={reduceMotion ? false : 'visible'}
          >
            {toFieldRows(data).map((row) => (
              <motion.div key={row.label} variants={reduceMotion ? undefined : fadeInUp}>
                <Field {...row} />
              </motion.div>
            ))}
          </motion.dl>
        )}
      </CardContent>
    </Card>
  );
}
