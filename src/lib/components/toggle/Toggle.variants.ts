import { cva, type VariantProps } from 'class-variance-authority';

export const toggleVariants = cva(
	'inline-flex items-center justify-center gap-tight appearance-none cursor-pointer rounded-md font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:focus-visible:ring-[3px] dark:focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:hover:bg-primary/15',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				outline: 'border border-border bg-transparent'
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

export type ToggleVariantProps = VariantProps<typeof toggleVariants>;
