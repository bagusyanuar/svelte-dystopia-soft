import { cva, type VariantProps } from 'class-variance-authority';

export const spinnerVariants = cva('animate-spin', {
	variants: {
		size: {
			sm: 'size-3',
			md: 'size-4',
			lg: 'size-6'
		}
	},
	defaultVariants: {
		size: 'md'
	}
});

export type SpinnerVariantProps = VariantProps<typeof spinnerVariants>;
