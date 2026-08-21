import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { TextFieldVariantProps } from './TextField.variants.js';

export interface TextFieldProps
	extends Omit<HTMLInputAttributes, 'size' | 'prefix'>, TextFieldVariantProps {
	/** Applied to the container element; `classes` targets the inner parts. */
	class?: string;
	classes?: {
		input?: string;
		prefix?: string;
		suffix?: string;
	};
	ref?: HTMLInputElement | null;
	value?: string;
	invalid?: boolean;
	prefix?: Snippet;
	suffix?: Snippet;
}
