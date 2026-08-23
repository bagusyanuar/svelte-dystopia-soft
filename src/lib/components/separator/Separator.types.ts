import type { HTMLAttributes } from 'svelte/elements';
import type { SeparatorVariantProps } from './Separator.variants.js';

export interface SeparatorProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, SeparatorVariantProps {
	class?: string;
	/** Purely visual with no semantic meaning (default). Set to `false` if it separates distinct sections that assistive tech should announce. */
	decorative?: boolean;
}
