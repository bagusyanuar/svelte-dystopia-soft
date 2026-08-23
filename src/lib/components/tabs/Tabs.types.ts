import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	value?: string;
	children: Snippet;
}
