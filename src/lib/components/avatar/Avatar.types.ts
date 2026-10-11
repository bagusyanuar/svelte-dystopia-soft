import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLImgAttributes } from 'svelte/elements';

export type AvatarStatus = 'loading' | 'loaded' | 'error';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
	class?: string;
	classes?: {
		image?: string;
		fallback?: string;
	};
	src?: string;
	alt: string;
	/** Reference to the root `<span>` element */
	ref?: HTMLSpanElement | null;
	/** Reference to the inner `<img>` element (when rendered) */
	imageRef?: HTMLImageElement | null;
	/** Optional native attributes for the inner `<img>` element */
	imageProps?: Omit<HTMLImgAttributes, 'src' | 'alt'>;
	/**
	 * Shown while the image is loading, missing, or fails to load — e.g. initials.
	 * Receives the current avatar status (`loading` | `loaded` | `error`).
	 */
	children?: Snippet<[{ status: AvatarStatus }]>;
}
