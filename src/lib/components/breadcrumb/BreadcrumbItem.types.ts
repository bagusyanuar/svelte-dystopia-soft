import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface BreadcrumbItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
	class?: string;
	/** Reference to the `<li>` element */
	ref?: HTMLLIElement | null;
	children?: Snippet;
}
