import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	class?: string;
	collapsed?: boolean;
	children: Snippet;
}
