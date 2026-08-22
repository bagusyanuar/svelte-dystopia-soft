import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export interface DropdownItemProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	class?: string;
	disabled?: boolean;
	onSelect?: () => void;
	children: Snippet;
}
