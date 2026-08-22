import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { ButtonVariantProps } from './Button.variants.js';

export interface ButtonProps extends HTMLButtonAttributes, ButtonVariantProps {
	class?: string;
	ref?: HTMLButtonElement | null;
	children: Snippet;
	child?: Snippet<[{ props: Record<string, unknown> }]>;
	isLoading?: boolean;
	/** Replaces the built-in spinner shown while `isLoading` is true. */
	loading?: Snippet;
}
