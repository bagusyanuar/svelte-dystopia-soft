import { cva, type VariantProps } from 'class-variance-authority';

export const checkboxVariants = cva(
	'group relative inline-flex shrink-0 align-middle data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
	{
		variants: {
			size: {
				sm: 'size-4 [&_svg]:size-3',
				md: 'size-5 [&_svg]:size-3.5',
				lg: 'size-6 [&_svg]:size-4'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
);

export type CheckboxVariantProps = VariantProps<typeof checkboxVariants>;
