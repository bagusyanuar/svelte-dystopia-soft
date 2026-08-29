import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { SidebarItemVariantProps } from './SidebarItem.variants.js';

export interface SidebarItemProps
	extends Omit<HTMLButtonAttributes, 'children' | 'class'>, SidebarItemVariantProps {
	class?: string;
	icon?: Snippet;
	children: Snippet;
	child?: Snippet<[{ props: Record<string, unknown> }]>;
}
