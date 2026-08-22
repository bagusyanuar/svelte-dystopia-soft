import { cva, type VariantProps } from 'class-variance-authority';

export const radioVariants = cva(
	'group relative inline-flex shrink-0 align-middle data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
	{
		variants: {
			size: {
				sm: 'size-4',
				md: 'size-5',
				lg: 'size-6'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
);

export type RadioVariantProps = VariantProps<typeof radioVariants>;
