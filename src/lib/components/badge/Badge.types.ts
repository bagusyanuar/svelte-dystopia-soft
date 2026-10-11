import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { BadgeSize, BadgeVariant, BadgeVariantProps } from './Badge.variants.js';

export type { BadgeVariant, BadgeSize };

export interface BadgeProps
	extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, BadgeVariantProps {
	class?: string;
	/** Reference to the root `<span>` element */
	ref?: HTMLSpanElement | null;
	/**
	 * Content to render inside the badge.
	 * Receives the current active variant (`{ variant }`).
	 */
	children?: Snippet<[{ variant: BadgeVariant }]>;
}
