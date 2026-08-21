import { cva, type VariantProps } from 'class-variance-authority';

export const typographyVariants = cva('', {
	variants: {
		variant: {
			h1: 'text-2xl font-semibold tracking-tight text-foreground',
			h2: 'text-xl font-semibold tracking-tight text-foreground',
			h3: 'text-lg font-medium text-foreground',
			h4: 'text-base font-medium text-foreground',
			body: 'text-sm text-foreground-muted',
			small: 'text-xs text-foreground-muted',
			muted: 'text-sm text-foreground-subtle'
		}
	},
	defaultVariants: {
		variant: 'body'
	}
});

export type TypographyVariantProps = VariantProps<typeof typographyVariants>;
