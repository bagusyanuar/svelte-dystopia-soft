import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed',
	{
		variants: {
			variant: {
				default: 'bg-accent-500 text-white hover:bg-accent-600',
				outline: 'border border-slate-200 bg-transparent hover:bg-slate-50',
				ghost: 'bg-transparent hover:bg-slate-50'
			},
			size: {
				sm: 'h-8 px-3 text-sm',
				md: 'h-10 px-4 text-sm',
				lg: 'h-12 px-6 text-base'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
