import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { TypographyVariantProps } from './Typography.variants.js';

export type TypographyElement =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'p'
	| 'span'
	| 'div'
	| 'label'
	| 'strong'
	| 'small'
	| 'code'
	| 'blockquote';

export interface TypographyChildProps {
	props: Record<string, unknown>;
	variant: NonNullable<TypographyVariantProps['variant']>;
}

export interface TypographyProps extends HTMLAttributes<HTMLElement>, TypographyVariantProps {
	class?: string;
	/** Overrides the element the variant would otherwise imply, leaving the styling untouched. */
	as?: TypographyElement;
	/** Bindable ref to the rendered DOM element. */
	ref?: HTMLElement | null;
	/** Text content alternative to children snippet. */
	text?: string;
	/** Child snippet pattern for full element swap. */
	child?: Snippet<[TypographyChildProps]>;
	/** Children snippet. */
	children?: Snippet;
}

