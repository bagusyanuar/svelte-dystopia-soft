import { cva, type VariantProps } from 'class-variance-authority';

export const toastVariants = cva(
	'pointer-events-auto flex w-full gap-loose rounded-lg border bg-surface p-4 text-sm shadow-sm',
	{
		variants: {
			variant: {
				default: 'border-border text-foreground-muted',
				danger: 'border-danger-border text-foreground-muted',
				warning: 'border-warning-border text-foreground-muted',
				success: 'border-success-border text-foreground-muted'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
);

export type ToastVariantProps = VariantProps<typeof toastVariants>;
