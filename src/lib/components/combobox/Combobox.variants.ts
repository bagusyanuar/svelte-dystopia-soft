import { cva, type VariantProps } from 'class-variance-authority';

export const comboboxVariants = cva(
	'flex w-full cursor-pointer items-center gap-cozy rounded-md border border-border bg-surface text-left text-foreground transition-colors duration-150 hover:border-border-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-danger-border data-invalid:focus-visible:ring-danger',
	{
		variants: {
			size: {
				sm: 'min-h-8 px-2 py-1 text-xs',
				md: 'min-h-10 px-3 py-1.5 text-sm',
				lg: 'min-h-12 px-control-x py-2 text-base'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
);

export const comboboxOptionVariants = cva(
	'flex cursor-pointer items-center gap-tight rounded-md px-compact py-2 text-sm text-foreground-soft leading-snug transition-colors duration-150',
	{
		variants: {
			active: {
				true: 'bg-surface-subtle',
				false: ''
			},
			selected: {
				true: 'font-medium text-primary',
				false: ''
			},
			disabled: {
				true: 'pointer-events-none opacity-50',
				false: ''
			}
		},
		defaultVariants: {
			active: false,
			selected: false,
			disabled: false
		}
	}
);

export const comboboxChipVariants = cva(
	'inline-flex max-w-40 items-center gap-tight rounded-md border border-border bg-surface-subtle py-0.5 pr-1 pl-2 text-xs leading-snug font-medium text-foreground-soft'
);

export type ComboboxVariantProps = VariantProps<typeof comboboxVariants>;
