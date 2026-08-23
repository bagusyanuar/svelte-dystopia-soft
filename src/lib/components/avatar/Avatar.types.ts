import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
	class?: string;
	classes?: {
		image?: string;
		fallback?: string;
	};
	src?: string;
	alt: string;
	/** Shown while the image is loading, missing, or fails to load — e.g. initials. */
	children?: Snippet;
}
