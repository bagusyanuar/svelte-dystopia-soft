import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface BreadcrumbListProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
	class?: string;
	/** Reference to the root `<ol>` element */
	ref?: HTMLOListElement | null;
	children?: Snippet;
}
