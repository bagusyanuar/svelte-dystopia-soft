import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface BreadcrumbPageProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
	class?: string;
	/** Reference to the root `<span>` element */
	ref?: HTMLSpanElement | null;
	children?: Snippet;
}
