import { cva, type VariantProps } from 'class-variance-authority';

export const textareaVariants = cva(
	'w-full resize-y rounded-lg text-foreground-soft outline-none transition-colors duration-150 placeholder:text-foreground-faint focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:resize-none disabled:opacity-50 data-[invalid]:border-danger-border data-[invalid]:focus-visible:ring-danger',
	{
		variants: {
			variant: {
				default: 'border border-border bg-surface hover:border-border-hover',
				ghost: 'border border-transparent bg-surface-subtle hover:bg-surface-hover'
			},
			size: {
				sm: 'min-h-16 p-2 text-sm',
				md: 'min-h-24 p-3 text-sm',
				lg: 'min-h-32 p-4 text-base'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
);

export type TextareaVariantProps = VariantProps<typeof textareaVariants>;
