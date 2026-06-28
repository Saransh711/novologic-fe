'use client';

import { type ComponentPropsWithoutRef } from 'react';
import { DropdownMenu as RadixMenu } from 'radix-ui';
import { Check } from 'lucide-react';
import { ui } from '@/config';
import { cn } from '@/lib/utils/cn';

/**
 * Dropdown menu built on Radix DropdownMenu — focus management, typeahead,
 * arrow-key navigation, and `Esc`/outside-click handling come for free. Styled
 * entirely from tokens. Primary use: collapsing low-priority actions (e.g. a
 * toolbar's overflow) behind a trigger on small screens.
 */
export const Menu = RadixMenu.Root;
export const MenuTrigger = RadixMenu.Trigger;
export const MenuGroup = RadixMenu.Group;

export function MenuContent({
  className,
  sideOffset = ui.menu.sideOffset,
  align = 'start',
  ...props
}: ComponentPropsWithoutRef<typeof RadixMenu.Content>) {
  return (
    <RadixMenu.Portal>
      <RadixMenu.Content
        sideOffset={sideOffset}
        align={align}
        className={cn(
          'anim-menu z-dropdown min-w-48 overflow-hidden rounded-lg border border-border bg-surface p-1 shadow-lg',
          className,
        )}
        {...props}
      />
    </RadixMenu.Portal>
  );
}

const itemBase =
  'relative flex select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors duration-fast ease-standard data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:h-4 [&_svg]:w-4';

export type MenuItemVariant = 'default' | 'danger';

const itemVariant: Record<MenuItemVariant, string> = {
  default: 'text-foreground data-[highlighted]:bg-surface-muted',
  danger: 'text-danger data-[highlighted]:bg-danger/10',
};

export interface MenuItemProps extends ComponentPropsWithoutRef<typeof RadixMenu.Item> {
  variant?: MenuItemVariant;
}

export function MenuItem({ className, variant = 'default', ...props }: MenuItemProps) {
  return <RadixMenu.Item className={cn(itemBase, itemVariant[variant], className)} {...props} />;
}

/** Toggleable menu entry (e.g. a formatting option) with a check indicator. */
export function MenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof RadixMenu.CheckboxItem>) {
  return (
    <RadixMenu.CheckboxItem className={cn(itemBase, itemVariant.default, 'pl-8', className)} {...props}>
      <RadixMenu.ItemIndicator className="absolute left-2 inline-flex items-center">
        <Check aria-hidden />
      </RadixMenu.ItemIndicator>
      {children}
    </RadixMenu.CheckboxItem>
  );
}

export function MenuLabel({ className, ...props }: ComponentPropsWithoutRef<typeof RadixMenu.Label>) {
  return (
    <RadixMenu.Label className={cn('px-3 py-1.5 text-xs font-medium text-muted', className)} {...props} />
  );
}

export function MenuSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixMenu.Separator>) {
  return <RadixMenu.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}
