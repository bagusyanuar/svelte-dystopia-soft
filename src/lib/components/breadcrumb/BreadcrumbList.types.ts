import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface BreadcrumbListProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
	class?: string;
	children: Snippet;
}
