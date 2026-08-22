import { cva, type VariantProps } from 'class-variance-authority';

export const switchVariants = cva(
	'group relative inline-flex shrink-0 align-middle data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
	{
		variants: {
			size: {
				sm: 'h-4 w-7',
				md: 'h-5 w-9',
				lg: 'h-6 w-11'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
);

export const switchThumbVariants = cva(
	'pointer-events-none absolute top-0.5 left-0.5 rounded-full bg-foreground-faint shadow-sm peer-checked:bg-surface transition-transform duration-150',
	{
		variants: {
			size: {
				sm: 'size-3 peer-checked:translate-x-3',
				md: 'size-4 peer-checked:translate-x-4',
				lg: 'size-5 peer-checked:translate-x-5'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
);

export type SwitchVariantProps = VariantProps<typeof switchVariants>;
