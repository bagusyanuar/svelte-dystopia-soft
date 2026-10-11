import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
	'inline-flex w-fit items-center gap-tight font-medium transition-colors duration-150',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground',
				secondary: 'border border-border bg-surface-subtle text-foreground-soft',
				outline: 'border border-border bg-transparent text-foreground-soft',
				danger: 'bg-danger text-danger-foreground',
				success: 'bg-success text-success-foreground',
				warning: 'bg-warning text-warning-foreground',
				info: 'bg-info text-info-foreground'
			},
			size: {
				sm: 'rounded px-1.5 py-0.5 text-[11px]',
				md: 'rounded-md px-2.5 py-0.5 text-xs',
				lg: 'rounded-md px-3 py-1 text-sm'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>['size']>;
export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
