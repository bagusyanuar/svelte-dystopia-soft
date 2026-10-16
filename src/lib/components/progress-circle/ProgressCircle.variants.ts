import { cva, type VariantProps } from 'class-variance-authority';

export const progressCircleVariants = cva(
	'relative inline-flex items-center justify-center shrink-0',
	{
		variants: {
			size: {
				xs: 'size-6',
				sm: 'size-8',
				md: 'size-12',
				lg: 'size-16',
				xl: 'size-20'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
);

export type ProgressCircleVariantProps = VariantProps<typeof progressCircleVariants>;
