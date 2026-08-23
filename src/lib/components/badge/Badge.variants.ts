import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
	'inline-flex w-fit items-center gap-tight rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors duration-150',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground',
				secondary: 'border border-border bg-surface-subtle text-foreground-soft',
				outline: 'border border-border bg-transparent text-foreground-soft',
				danger: 'bg-danger text-danger-foreground'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
