/**
 * Cross-primitive class fragments. Keeping these in one place means the focus
 * treatment and interactive variants stay identical across every control, and a
 * change to the look only happens here. All values resolve to design tokens.
 */

/** Token-driven focus ring applied to every keyboard-focusable control. */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

export type InteractiveVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/** Surface/colour treatment shared by Button and IconButton. */
export const interactiveVariant: Record<InteractiveVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90',
  secondary: 'border border-border bg-surface text-foreground shadow-sm hover:bg-surface-muted',
  ghost: 'text-foreground hover:bg-surface-muted',
  danger: 'bg-danger text-danger-foreground shadow-sm hover:opacity-90',
};

/**
 * Base treatment for pressable controls: layout, the token focus ring, a
 * disabled state, a colour/transform transition, and a subtle press-in that is
 * skipped when the user prefers reduced motion (`motion-safe`).
 */
export const pressableBase =
  `inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition duration-base ease-standard disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-95 ${focusRing}`;
