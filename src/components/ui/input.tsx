import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { focusRing } from './styles';

export type InputSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 rounded-md px-2.5 text-sm',
  md: 'h-10 rounded-lg px-3 text-sm',
  lg: 'h-12 rounded-lg px-4 text-base',
};

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputSize;
  /** Marks the field invalid: wires `aria-invalid` and a danger treatment. */
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize = 'md', invalid = false, className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        'flex w-full border border-border bg-surface text-foreground shadow-sm transition-colors duration-fast ease-standard',
        'placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger',
        focusRing,
        sizeClasses[inputSize],
        className,
      )}
      {...props}
    />
  );
});
