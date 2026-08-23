import type { Snippet } from 'svelte';
import type { HTMLTableAttributes } from 'svelte/elements';

export interface TableProps extends HTMLTableAttributes {
	/** Applied to the outermost scroll wrapper. */
	class?: string;
	classes?: {
		table?: string;
	};
	children: Snippet;
}
