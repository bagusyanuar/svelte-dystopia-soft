import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface PaginationItemProps extends HTMLAttributes<HTMLLIElement> {
	class?: string;
	children: Snippet;
}
