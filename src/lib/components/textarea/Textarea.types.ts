import type { HTMLTextareaAttributes } from 'svelte/elements';
import type { TextareaVariantProps } from './Textarea.variants.js';

export interface TextareaProps extends Omit<HTMLTextareaAttributes, 'size'>, TextareaVariantProps {
	/** Applied to the outermost wrapper, including the character counter. */
	class?: string;
	classes?: {
		textarea?: string;
		counter?: string;
	};
	ref?: HTMLTextAreaElement | null;
	value?: string;
	invalid?: boolean;
	/** Grows the box to fit its content instead of scrolling; disables manual drag-resize. */
	autoResize?: boolean;
}
