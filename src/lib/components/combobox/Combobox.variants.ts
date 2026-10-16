import { cva, type VariantProps } from 'class-variance-authority';

export const comboboxVariants = cva(
	'flex w-full cursor-pointer items-center gap-cozy rounded-md border border-border bg-surface text-left text-foreground-soft transition-all duration-150 hover:border-border-hover focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0 focus-visible:hover:border-primary dark:focus-visible:ring-[3px] dark:focus-visible:ring-primary/20 data-[state=open]:border-primary data-[state=open]:ring-0 data-[state=open]:hover:border-primary dark:data-[state=open]:ring-[3px] dark:data-[state=open]:ring-primary/20 data-[invalid]:border-danger data-[invalid]:hover:border-danger data-[invalid]:focus-visible:border-danger dark:data-[invalid]:focus-visible:ring-[3px] dark:data-[invalid]:focus-visible:ring-danger/25 data-[invalid]:data-[state=open]:border-danger dark:data-[invalid]:data-[state=open]:ring-[3px] dark:data-[invalid]:data-[state=open]:ring-danger/25 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
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

export const comboboxSearchVariants = cva(
	'flex shrink-0 items-center gap-tight border-b border-border',
	{
		variants: {
			size: {
				sm: 'px-2',
				md: 'px-compact',
				lg: 'px-control-x'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
);

export const comboboxInputVariants = cva(
	'w-full flex-1 bg-transparent leading-snug text-foreground placeholder:text-foreground-faint focus:outline-none',
	{
		variants: {
			size: {
				sm: 'h-8 text-xs',
				md: 'h-10 text-sm',
				lg: 'h-12 text-base'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
);

export const comboboxOptionVariants = cva(
	'flex cursor-pointer items-center gap-tight rounded-md text-foreground-soft leading-snug transition-colors duration-150',
	{
		variants: {
			size: {
				sm: 'px-2 py-1.5 text-xs',
				md: 'px-compact py-2 text-sm',
				lg: 'px-control-x py-2.5 text-base'
			},
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
			size: 'md',
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

