import { cva, type VariantProps } from 'class-variance-authority';

export const paginationNextVariants = cva(
	'inline-flex cursor-pointer items-center gap-tight rounded-md leading-snug text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			size: {
				sm: 'h-8 px-2 text-sm',
				md: 'h-9 px-3 text-sm',
				lg: 'h-10 px-3.5 text-sm'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
);

export type PaginationNextVariantProps = VariantProps<typeof paginationNextVariants>;
