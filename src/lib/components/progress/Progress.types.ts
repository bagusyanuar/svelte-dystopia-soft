import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ProgressVariantProps } from './Progress.variants.js';

export interface ProgressClasses {
	root?: string;
	fill?: string;
	indicator?: string;
}

export interface ProgressSnippetPayload {
	value: number;
	max: number;
	percentage: number;
	indeterminate: boolean;
}

export interface ProgressProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, ProgressVariantProps {
	class?: string;
	classes?: ProgressClasses;
	value?: number;
	max?: number;
	/** Shows a sweeping animation instead of a fixed fill, for a duration that isn't known upfront. */
	indeterminate?: boolean;
	/** Animates the progress fill from 0 to the target value on initial mount. */
	animated?: boolean;
	/** Binding for the outer root progress container element. */
	ref?: HTMLDivElement | null;
	/** Binding for the inner fill/indicator element. */
	fillRef?: HTMLDivElement | null;
	/** Custom indicator snippet to replace the default progress fill element. */
	indicator?: Snippet<[ProgressSnippetPayload]>;
	/** Optional children snippet rendered inside the progressbar container. */
	children?: Snippet<[ProgressSnippetPayload]>;
}
