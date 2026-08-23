import type { Snippet } from 'svelte';
import type { HTMLThAttributes } from 'svelte/elements';

export interface TableHeadProps extends HTMLThAttributes {
	class?: string;
	children: Snippet;
}
