import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-tight appearance-none cursor-pointer rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:focus-visible:ring-[3px] dark:focus-visible:ring-primary/25 disabled:opacity-50 disabled:cursor-not-allowed',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground hover:bg-primary-hover dark:hover:shadow-[0_0_14px_-2px_var(--primary)]',
				outline: 'border border-border bg-transparent hover:bg-surface-subtle',
				ghost: 'bg-transparent hover:bg-surface-subtle'
			},
			size: {
				xs: 'h-6 px-2 text-xs',
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
