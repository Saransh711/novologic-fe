'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Toast as RadixToast } from 'radix-ui';
import { Check, Info, TriangleAlert, X } from 'lucide-react';
import { labels, ui } from '@/config';
import { tokens } from '@/design/tokens';
import { cn } from '@/lib/utils/cn';
import { IconButton } from './icon-button';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  title: string;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Override the default auto-dismiss delay (ms). */
  durationMs?: number;
}

interface ToastRecord extends ToastOptions {
  id: number;
  open: boolean;
}

interface ToastContextValue {
  /** Enqueue a toast; returns its id so it can be dismissed programmatically. */
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantConfig: Record<ToastVariant, { icon: typeof Info; accent: string; tone: string }> = {
  default: { icon: Info, accent: 'border-l-border', tone: 'text-muted' },
  success: { icon: Check, accent: 'border-l-success', tone: 'text-success' },
  warning: { icon: TriangleAlert, accent: 'border-l-warning', tone: 'text-warning' },
  danger: { icon: TriangleAlert, accent: 'border-l-danger', tone: 'text-danger' },
};

/**
 * Hosts the toast queue and the Radix viewport. Mount once near the root.
 * Children rendered inside can raise toasts through {@link useToast}.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const setOpen = useCallback(
    (id: number, open: boolean) => {
      setToasts((current) => current.map((item) => (item.id === id ? { ...item, open } : item)));
      if (!open) {
        // Let the close animation finish before unmounting the node.
        window.setTimeout(() => remove(id), tokens.motion.duration.slow);
      }
    },
    [remove],
  );

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    const record: ToastRecord = { variant: 'default', ...options, id, open: true };
    setToasts((current) => [...current, record].slice(-ui.toast.limit));
    return id;
  }, []);

  const dismiss = useCallback((id: number) => setOpen(id, false), [setOpen]);

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="right" duration={ui.toast.durationMs} label={labels.a11y.notifications}>
        {children}

        {toasts.map(({ id, title, description, variant = 'default', durationMs, open }) => {
          const { icon: Icon, accent, tone } = variantConfig[variant];
          return (
            <RadixToast.Root
              key={id}
              open={open}
              duration={durationMs}
              onOpenChange={(next) => setOpen(id, next)}
              className={cn(
                'toast-root pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-l-4 border-border bg-surface p-4 shadow-lg',
                accent,
              )}
            >
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', tone)} aria-hidden />
              <div className="flex-1 space-y-1">
                <RadixToast.Title className="text-sm font-semibold text-foreground">
                  {title}
                </RadixToast.Title>
                {description ? (
                  <RadixToast.Description className="text-sm text-muted">
                    {description}
                  </RadixToast.Description>
                ) : null}
              </div>
              <RadixToast.Close asChild>
                <IconButton
                  aria-label={labels.a11y.dismissNotification}
                  variant="ghost"
                  size="sm"
                  className="-mr-1 -mt-1 shrink-0"
                >
                  <X aria-hidden />
                </IconButton>
              </RadixToast.Close>
            </RadixToast.Root>
          );
        })}

        <RadixToast.Viewport className="pointer-events-none fixed bottom-0 right-0 z-toast flex w-full flex-col gap-2 p-4 outline-none sm:max-w-sm" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

/** Access the imperative toast API. Must be called under a {@link ToastProvider}. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
