import type { HTMLButtonAttributes } from 'svelte/elements';
import type { PaginationPreviousVariantProps } from './PaginationPrevious.variants.js';

export interface PaginationPreviousProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	class?: string;
	/** Accessible + visible label. Defaults to "Previous" — override for localization. */
	label?: string;
	/** Density variant. Default 'md'. */
	size?: PaginationPreviousVariantProps['size'];
}
