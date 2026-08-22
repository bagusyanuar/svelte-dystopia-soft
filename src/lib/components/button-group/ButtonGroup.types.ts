import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ButtonGroupVariantProps } from './ButtonGroup.variants.js';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement>, ButtonGroupVariantProps {
	class?: string;
	children: Snippet;
}
