/**
 * Cross-primitive class fragments. Keeping these in one place means the focus
 * treatment and interactive variants stay identical across every control, and a
 * change to the look only happens here. All values resolve to design tokens.
 */

/** Token-driven focus ring applied to every keyboard-focusable control. */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

export type InteractiveVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * Surface/colour treatment shared by Button and IconButton. Solid and outlined
 * variants gain a touch more elevation on hover so they feel like they lift
 * toward the pointer; `ghost` stays flat (just a surface wash) for dense
 * contexts like toolbars and the header.
 */
export const interactiveVariant: Record<InteractiveVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90 hover:shadow-md',
  secondary:
    'border border-border bg-surface text-foreground shadow-sm hover:bg-surface-muted hover:shadow-md',
  ghost: 'text-foreground hover:bg-surface-muted',
  danger: 'bg-danger text-danger-foreground shadow-sm hover:opacity-90 hover:shadow-md',
};

/**
 * Base treatment for pressable controls: layout, the token focus ring, a
 * disabled state, and a transition covering colour, shadow, and transform. The
 * motion is tactile but restrained — a hairline hover lift and a press-in — and
 * both transforms are skipped when the user prefers reduced motion
 * (`motion-safe`).
 */
export const pressableBase =
  `inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition duration-base ease-standard disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97] ${focusRing}`;
