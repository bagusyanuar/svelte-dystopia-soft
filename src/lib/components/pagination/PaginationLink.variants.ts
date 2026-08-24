import { cva, type VariantProps } from 'class-variance-authority';

export const paginationLinkVariants = cva(
	'inline-flex cursor-pointer items-center justify-center rounded-md leading-snug transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			active: {
				true: 'bg-primary text-primary-foreground',
				false: 'text-foreground-soft hover:bg-surface-subtle'
			},
			size: {
				sm: 'h-8 min-w-8 px-1.5 text-sm',
				md: 'h-9 min-w-9 px-2 text-sm',
				lg: 'h-10 min-w-10 px-2.5 text-sm'
			}
		},
		defaultVariants: {
			active: false,
			size: 'md'
		}
	}
);

export type PaginationLinkVariantProps = VariantProps<typeof paginationLinkVariants>;
