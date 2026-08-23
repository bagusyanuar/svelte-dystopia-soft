import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface TabsContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	value: string;
	children: Snippet;
}
