import type { HTMLAttributes } from 'svelte/elements';
import type { ProgressVariantProps } from './Progress.variants.js';

export interface ProgressProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, ProgressVariantProps {
	class?: string;
	classes?: {
		fill?: string;
	};
	value?: number;
	max?: number;
	/** Shows a sweeping animation instead of a fixed fill, for a duration that isn't known upfront. */
	indeterminate?: boolean;
}
