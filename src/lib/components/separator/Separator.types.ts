import type { HTMLAttributes } from 'svelte/elements';
import type { SeparatorVariantProps } from './Separator.variants.js';

export interface SeparatorProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, SeparatorVariantProps {
	/** Class kustom untuk menimpa class default divider. */
	class?: string;
	/** Bindable ref ke elemen DOM `<div>` root. */
	ref?: HTMLDivElement | null;
	/**
	 * Purely visual with no semantic meaning (default).
	 * Set to `false` if it separates distinct sections that assistive tech should announce.
	 */
	decorative?: boolean;
}
