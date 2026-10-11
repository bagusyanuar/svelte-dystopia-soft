import { cva, type VariantProps } from 'class-variance-authority';

export const textFieldVariants = cva(
	'flex w-full items-center gap-tight rounded-md text-foreground-soft transition-all duration-150 focus-within:border-primary focus-within:ring-0 dark:focus-within:ring-[3px] dark:focus-within:ring-primary/20 data-[invalid]:border-danger data-[invalid]:hover:border-danger data-[invalid]:focus-within:border-danger dark:data-[invalid]:focus-within:ring-[3px] dark:data-[invalid]:focus-within:ring-danger/25 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
	{
		variants: {
			variant: {
				default:
					'border border-border bg-surface hover:border-border-hover focus-within:hover:border-primary data-[invalid]:hover:border-danger data-[invalid]:focus-within:hover:border-danger',
				ghost:
					'border border-transparent bg-surface-subtle hover:bg-surface-hover focus-within:bg-surface focus-within:hover:border-primary data-[invalid]:hover:border-danger data-[invalid]:focus-within:hover:border-danger'
			},
			size: {
				sm: 'h-8 px-3 text-sm',
				md: 'h-10 px-3 text-sm',
				lg: 'h-12 px-control-x text-base'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
);

export type TextFieldVariantProps = VariantProps<typeof textFieldVariants>;
