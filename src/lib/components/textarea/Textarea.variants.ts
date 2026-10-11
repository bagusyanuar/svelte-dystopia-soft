import { cva, type VariantProps } from 'class-variance-authority';

export const textareaVariants = cva(
	'w-full resize-y rounded-md text-foreground-soft outline-none transition-all duration-150 placeholder:text-foreground-faint focus:border-primary focus:ring-0 dark:focus:ring-[3px] dark:focus:ring-primary/20 data-[invalid]:border-danger data-[invalid]:hover:border-danger data-[invalid]:focus:border-danger dark:data-[invalid]:focus:ring-[3px] dark:data-[invalid]:focus:ring-danger/25 disabled:cursor-not-allowed disabled:resize-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'border border-border bg-surface hover:border-border-hover focus:hover:border-primary data-[invalid]:hover:border-danger data-[invalid]:focus:hover:border-danger',
				ghost:
					'border border-transparent bg-surface-subtle hover:bg-surface-hover focus:bg-surface focus:hover:border-primary data-[invalid]:hover:border-danger data-[invalid]:focus:hover:border-danger'
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
