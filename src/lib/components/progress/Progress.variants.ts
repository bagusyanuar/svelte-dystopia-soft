import { cva, type VariantProps } from 'class-variance-authority';

export const progressVariants = cva('relative w-full overflow-hidden rounded-full bg-border', {
	variants: {
		size: {
			sm: 'h-1.5',
			md: 'h-2',
			lg: 'h-3'
		}
	},
	defaultVariants: {
		size: 'md'
	}
});

export type ProgressVariantProps = VariantProps<typeof progressVariants>;
