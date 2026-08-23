import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {
	class?: string;
	children: Snippet;
}
