import type { HTMLInputAttributes } from 'svelte/elements';
import type { CheckboxVariantProps } from './Checkbox.variants.js';

export interface CheckboxProps
	extends Omit<HTMLInputAttributes, 'size' | 'type'>, CheckboxVariantProps {
	/** Applied to the container element; `classes` targets the inner parts. */
	class?: string;
	classes?: {
		input?: string;
		indicator?: string;
	};
	ref?: HTMLInputElement | null;
	checked?: boolean;
	/** Mixed state, e.g. a parent of partially selected children. Cleared by the user clicking. */
	indeterminate?: boolean;
	invalid?: boolean;
}
