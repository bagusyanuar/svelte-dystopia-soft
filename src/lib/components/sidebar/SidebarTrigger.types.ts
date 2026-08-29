import type { HTMLButtonAttributes } from 'svelte/elements';

export interface SidebarTriggerProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	class?: string;
	labels?: { expand?: string; collapse?: string };
}
