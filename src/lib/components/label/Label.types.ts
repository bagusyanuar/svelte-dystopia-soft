import type { Snippet } from 'svelte';
import type { HTMLLabelAttributes } from 'svelte/elements';

export interface LabelProps extends HTMLLabelAttributes {
	class?: string;
	/** Renders a required marker, hidden from assistive tech — the input's own `required` announces it. */
	required?: boolean;
	disabled?: boolean;
	children: Snippet;
}
