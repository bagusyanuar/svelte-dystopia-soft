import type { HTMLInputAttributes } from 'svelte/elements';
import type { SwitchVariantProps } from './Switch.variants.js';

export interface SwitchProps
	extends Omit<HTMLInputAttributes, 'size' | 'type'>, SwitchVariantProps {
	/** Applied to the container element; `classes` targets the inner parts. */
	class?: string;
	classes?: {
		input?: string;
		thumb?: string;
	};
	ref?: HTMLInputElement | null;
	checked?: boolean;
	invalid?: boolean;
}
