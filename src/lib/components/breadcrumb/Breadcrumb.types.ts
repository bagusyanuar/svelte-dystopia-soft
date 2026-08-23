import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	class?: string;
	children: Snippet;
}
