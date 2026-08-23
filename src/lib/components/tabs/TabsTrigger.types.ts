import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export interface TabsTriggerProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	class?: string;
	value: string;
	disabled?: boolean;
	children: Snippet;
}
