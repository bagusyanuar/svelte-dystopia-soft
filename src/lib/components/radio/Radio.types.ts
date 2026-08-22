import type { HTMLInputAttributes } from 'svelte/elements';
import type { RadioVariantProps } from './Radio.variants.js';

export interface RadioProps
	extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value'>, RadioVariantProps {
	/** Applied to the container element; `classes` targets the inner parts. */
	class?: string;
	classes?: {
		input?: string;
		indicator?: string;
	};
	ref?: HTMLInputElement | null;
	/** This radio's own value — compared against `group` to determine checked state. */
	value: string;
	/** The selected value shared across all radios with the same `name`. */
	group?: string;
	invalid?: boolean;
}
