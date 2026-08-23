import { cva, type VariantProps } from 'class-variance-authority';

export const paginationLinkVariants = cva(
	'inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md px-2 text-sm leading-snug transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			active: {
				true: 'bg-primary text-primary-foreground',
				false: 'text-foreground-soft hover:bg-surface-subtle'
			}
		},
		defaultVariants: {
			active: false
		}
	}
);

export type PaginationLinkVariantProps = VariantProps<typeof paginationLinkVariants>;
