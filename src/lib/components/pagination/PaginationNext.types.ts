import type { HTMLButtonAttributes } from 'svelte/elements';
import type { PaginationNextVariantProps } from './PaginationNext.variants.js';

export interface PaginationNextProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	class?: string;
	/** Accessible + visible label. Defaults to "Next" — override for localization. */
	label?: string;
	/** Density variant. Default 'md'. */
	size?: PaginationNextVariantProps['size'];
}
