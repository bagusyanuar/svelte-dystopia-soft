import { cva, type VariantProps } from 'class-variance-authority';

export const selectVariants = cva(
	'w-full cursor-pointer appearance-none rounded-md bg-surface pr-8 text-foreground-soft transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-danger-border data-[invalid]:focus-visible:ring-danger',
	{
		variants: {
			variant: {
				default: 'border border-border hover:border-border-hover',
				ghost: 'border border-transparent bg-surface-subtle hover:bg-surface-hover'
			},
			size: {
				sm: 'h-8 pl-3 text-sm',
				md: 'h-10 pl-3 text-sm',
				lg: 'h-12 pl-control-x text-base'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
);

export type SelectVariantProps = VariantProps<typeof selectVariants>;
