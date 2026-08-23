import { cva, type VariantProps } from 'class-variance-authority';

export const typographyVariants = cva('', {
	variants: {
		variant: {
			h1: 'text-2xl leading-tight font-semibold tracking-tight text-foreground',
			h2: 'text-xl leading-tight font-semibold tracking-tight text-foreground',
			h3: 'text-lg leading-tight font-medium text-foreground',
			h4: 'text-base leading-tight font-medium text-foreground',
			body: 'text-sm text-foreground-muted',
			small: 'text-xs leading-snug text-foreground-muted',
			muted: 'text-sm text-foreground-subtle'
		}
	},
	defaultVariants: {
		variant: 'body'
	}
});

export type TypographyVariantProps = VariantProps<typeof typographyVariants>;
