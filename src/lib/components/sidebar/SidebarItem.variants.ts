import { cva, type VariantProps } from 'class-variance-authority';

export const sidebarItemVariants = cva(
	'relative flex w-full cursor-pointer items-center gap-tight rounded-md px-compact py-control-y text-sm leading-snug font-normal text-foreground-soft transition-colors duration-150 hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			size: {
				default: '',
				sm: 'text-foreground-muted'
			},
			active: {
				true: 'bg-surface-subtle font-medium text-primary',
				false: ''
			}
		},
		defaultVariants: {
			size: 'default',
			active: false
		}
	}
);

export type SidebarItemVariantProps = VariantProps<typeof sidebarItemVariants>;
