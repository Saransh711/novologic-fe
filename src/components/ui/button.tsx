import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium select-none whitespace-nowrap rounded-lg transition-colors duration-base ease-standard focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90',
  secondary: 'border border-border bg-surface text-foreground hover:bg-surface-muted',
  ghost: 'text-foreground hover:bg-surface-muted',
  danger: 'bg-danger text-danger-foreground shadow-sm hover:opacity-90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
});
