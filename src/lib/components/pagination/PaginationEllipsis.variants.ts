import { cva, type VariantProps } from 'class-variance-authority';

export const paginationEllipsisVariants = cva(
	'flex items-center justify-center text-foreground-faint',
	{
		variants: {
			size: {
				sm: 'h-8 min-w-8',
				md: 'h-9 min-w-9',
				lg: 'h-10 min-w-10'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
);

export type PaginationEllipsisVariantProps = VariantProps<typeof paginationEllipsisVariants>;
