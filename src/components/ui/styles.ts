
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

export type InteractiveVariant = 'primary' | 'secondary' | 'ghost' | 'danger';


export const interactiveVariant: Record<InteractiveVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90 hover:shadow-md',
  secondary:
    'border border-border bg-surface text-foreground shadow-sm hover:bg-surface-muted hover:shadow-md',
  ghost: 'text-foreground hover:bg-surface-muted',
  danger: 'bg-danger text-danger-foreground shadow-sm hover:opacity-90 hover:shadow-md',
};


export const pressableBase =
  `inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition duration-base ease-standard disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97] ${focusRing}`;
