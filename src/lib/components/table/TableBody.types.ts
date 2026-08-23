import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
	class?: string;
	children: Snippet;
}
