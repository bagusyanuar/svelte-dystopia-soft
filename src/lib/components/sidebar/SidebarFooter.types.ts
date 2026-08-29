import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
	class?: string;
	children: Snippet;
}
