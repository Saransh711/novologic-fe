'use client';

import { type ComponentPropsWithoutRef, type HTMLAttributes, type ReactNode } from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
import { X } from 'lucide-react';
import { labels } from '@/config';
import { cn } from '@/lib/utils/cn';
import { IconButton } from './icon-button';

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export const Sheet = RadixDialog.Root;
export const SheetTrigger = RadixDialog.Trigger;
export const SheetClose = RadixDialog.Close;

function Overlay() {
  return (
    <RadixDialog.Overlay className="anim-overlay fixed inset-0 z-overlay bg-overlay" />
  );
}

function CloseButton() {
  return (
    <RadixDialog.Close asChild>
      <IconButton
        aria-label={labels.a11y.closeDialog}
        variant="ghost"
        size="sm"
        className="absolute right-3 top-3"
      >
        <X aria-hidden />
      </IconButton>
    </RadixDialog.Close>
  );
}

export interface DialogContentProps extends ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  showClose?: boolean;
}

export function DialogContent({ className, children, showClose = true, ...props }: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <Overlay />
      <div className="fixed inset-0 z-modal flex items-center justify-center overflow-y-auto p-4">
        <RadixDialog.Content
          className={cn(
            'anim-dialog relative my-auto w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-xl focus:outline-none',
            className,
          )}
          {...props}
        >
          {children}
          {showClose ? <CloseButton /> : null}
        </RadixDialog.Content>
      </div>
    </RadixDialog.Portal>
  );
}

export type SheetSide = 'left' | 'right';

export interface SheetContentProps extends ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  side?: SheetSide;
  showClose?: boolean;
}

const sheetSide: Record<SheetSide, string> = {
  right: 'anim-sheet-right inset-y-0 right-0 border-l',
  left: 'anim-sheet-left inset-y-0 left-0 border-r',
};

export function SheetContent({
  side = 'right',
  className,
  children,
  showClose = true,
  ...props
}: SheetContentProps) {
  return (
    <RadixDialog.Portal>
      <Overlay />
      <RadixDialog.Content
        className={cn(
          'fixed z-modal flex h-full w-full max-w-sm flex-col gap-6 border-border bg-surface p-6 shadow-xl focus:outline-none',
          sheetSide[side],
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? <CloseButton /> : null}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

type DivProps = HTMLAttributes<HTMLDivElement>;

export function DialogHeader({ className, ...props }: DivProps) {
  return <div className={cn('flex flex-col gap-1.5 pr-8', className)} {...props} />;
}

export function DialogTitle({ className, children, ...props }: { children: ReactNode } & ComponentPropsWithoutRef<typeof RadixDialog.Title>) {
  return (
    <RadixDialog.Title
      className={cn('text-lg font-semibold leading-snug text-foreground', className)}
      {...props}
    >
      {children}
    </RadixDialog.Title>
  );
}

export function DialogDescription({ className, children, ...props }: { children: ReactNode } & ComponentPropsWithoutRef<typeof RadixDialog.Description>) {
  return (
    <RadixDialog.Description className={cn('text-sm text-muted', className)} {...props}>
      {children}
    </RadixDialog.Description>
  );
}

export function DialogFooter({ className, ...props }: DivProps) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-3 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

export const SheetHeader = DialogHeader;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;
export const SheetFooter = DialogFooter;
