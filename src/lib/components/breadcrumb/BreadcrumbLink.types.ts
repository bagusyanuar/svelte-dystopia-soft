import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';

export interface BreadcrumbLinkProps extends Omit<HTMLAnchorAttributes, 'children' | 'class'> {
	class?: string;
	children: Snippet;
	/** Renders a consumer-supplied element (e.g. a router `Link`) instead of a plain `<a>`. */
	child?: Snippet<[{ props: Record<string, unknown> }]>;
}
