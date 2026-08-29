import { cva, type VariantProps } from 'class-variance-authority';

export const sidebarVariants = cva(
	'flex h-full flex-col shrink-0 border-r border-border bg-surface transition-[width] duration-150',
	{
		variants: {
			collapsed: {
				true: 'w-16',
				false: 'w-64'
			}
		},
		defaultVariants: {
			collapsed: false
		}
	}
);

export type SidebarVariantProps = VariantProps<typeof sidebarVariants>;
