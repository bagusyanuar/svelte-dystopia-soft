import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface TabsListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	children: Snippet;
}
