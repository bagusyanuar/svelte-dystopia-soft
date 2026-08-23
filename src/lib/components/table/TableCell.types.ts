import type { Snippet } from 'svelte';
import type { HTMLTdAttributes } from 'svelte/elements';

export interface TableCellProps extends HTMLTdAttributes {
	class?: string;
	children: Snippet;
}
