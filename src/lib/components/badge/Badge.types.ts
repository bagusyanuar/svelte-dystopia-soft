import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { BadgeVariantProps } from './Badge.variants.js';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BadgeVariantProps {
	class?: string;
	children: Snippet;
}
