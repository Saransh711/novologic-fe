import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { interactiveVariant, pressableBase, type InteractiveVariant } from './styles';
import { Spinner } from './spinner';

export type IconButtonVariant = InteractiveVariant;
export type IconButtonSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8 rounded-md [&_svg]:h-4 [&_svg]:w-4',
  md: 'h-10 w-10 rounded-lg [&_svg]:h-5 [&_svg]:w-5',
  lg: 'h-12 w-12 rounded-lg [&_svg]:h-6 [&_svg]:w-6',
};

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
  'aria-label': string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'ghost', size = 'md', isLoading = false, className, type = 'button', disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(pressableBase, interactiveVariant[variant], sizeClasses[size], className)}
      {...props}
    >
      {isLoading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} /> : children}
    </button>
  );
});
