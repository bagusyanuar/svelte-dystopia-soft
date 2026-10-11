import { cva, type VariantProps } from 'class-variance-authority';

export const toastVariants = cva(
	'pointer-events-auto flex w-full items-start gap-cozy rounded-lg border border-border bg-surface p-compact text-sm shadow-sm',
	{
		variants: {
			variant: {
				default: 'text-foreground',
				info: 'text-foreground',
				danger: 'text-foreground',
				warning: 'text-foreground',
				success: 'text-foreground'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
);

export type ToastVariantProps = VariantProps<typeof toastVariants>;
