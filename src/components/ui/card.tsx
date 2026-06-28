import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type DivProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn('rounded-xl border border-border bg-surface shadow-sm', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-semibold leading-snug text-foreground', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted', className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div className={cn('flex items-center gap-3 p-6 pt-0', className)} {...props} />;
}
