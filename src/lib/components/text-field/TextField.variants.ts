import { cva, type VariantProps } from 'class-variance-authority';

export const textFieldVariants = cva(
	'flex w-full items-center gap-2 rounded-lg text-foreground-soft transition-colors duration-150 focus-within:ring-2 focus-within:ring-ring data-[invalid]:border-danger-border data-[invalid]:focus-within:ring-danger data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
	{
		variants: {
			variant: {
				default: 'border border-border bg-surface hover:border-border-hover',
				ghost: 'border border-transparent bg-surface-subtle hover:bg-surface-hover'
			},
			size: {
				sm: 'h-8 px-3 text-sm',
				md: 'h-10 px-3 text-sm',
				lg: 'h-12 px-4 text-base'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
);

export type TextFieldVariantProps = VariantProps<typeof textFieldVariants>;
