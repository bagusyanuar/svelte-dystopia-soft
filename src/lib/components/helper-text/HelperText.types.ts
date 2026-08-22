import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
	class?: string;
	/** Switches styling to the danger color and announces the text as a validation error. */
	invalid?: boolean;
	children: Snippet;
}
