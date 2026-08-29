import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export interface SidebarCollapsibleItemProps extends Omit<
	HTMLButtonAttributes,
	'children' | 'class'
> {
	class?: string;
	open?: boolean;
	icon?: Snippet;
	trigger: Snippet;
	children: Snippet;
}
