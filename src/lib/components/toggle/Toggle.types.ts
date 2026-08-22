import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { ToggleVariantProps } from './Toggle.variants.js';

export interface ToggleProps extends Omit<HTMLButtonAttributes, 'type'>, ToggleVariantProps {
	class?: string;
	ref?: HTMLButtonElement | null;
	pressed?: boolean;
	children: Snippet;
}
