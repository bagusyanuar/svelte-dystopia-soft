import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-tight appearance-none cursor-pointer rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
				outline: 'border border-border bg-transparent hover:bg-surface-subtle',
				ghost: 'bg-transparent hover:bg-surface-subtle'
			},
			size: {
				sm: 'h-8 px-3 text-sm',
				md: 'h-10 px-control-x text-sm',
				lg: 'h-12 px-6 text-base'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
