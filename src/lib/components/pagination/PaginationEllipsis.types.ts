import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface PaginationEllipsisProps extends HTMLAttributes<HTMLSpanElement> {
	class?: string;
	children?: Snippet;
}
