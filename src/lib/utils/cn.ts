import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges conditional class names and resolves Tailwind conflicts (later classes
 * win), so primitives can expose a `className` override prop safely.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
