import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface BreadcrumbSeparatorProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
	class?: string;
	/** Replaces the default chevron icon. */
	children?: Snippet;
}
