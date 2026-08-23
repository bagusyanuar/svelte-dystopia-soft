import type { Snippet } from 'svelte';
import type { HTMLSelectAttributes } from 'svelte/elements';
import type { SelectVariantProps } from './Select.variants.js';

export interface SelectProps extends Omit<HTMLSelectAttributes, 'size'>, SelectVariantProps {
	/** Applied to the outermost wrapper. */
	class?: string;
	classes?: {
		select?: string;
		icon?: string;
	};
	ref?: HTMLSelectElement | null;
	value?: string;
	invalid?: boolean;
	/** `<option>`/`<optgroup>` elements. */
	children: Snippet;
}
