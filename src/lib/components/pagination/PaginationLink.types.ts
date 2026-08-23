import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export interface PaginationLinkProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	class?: string;
	/** Marks this as the current page — sets `aria-current="page"` and the active style. */
	active?: boolean;
	children: Snippet;
	/** Renders a consumer-supplied element (e.g. a router `Link`) instead of a plain `<button>`. */
	child?: Snippet<[{ props: Record<string, unknown> }]>;
}
