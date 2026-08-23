import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface PaginationListProps extends HTMLAttributes<HTMLUListElement> {
	class?: string;
	children: Snippet;
}
