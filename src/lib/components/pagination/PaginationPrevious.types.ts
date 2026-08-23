import type { HTMLButtonAttributes } from 'svelte/elements';

export interface PaginationPreviousProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	class?: string;
	/** Accessible + visible label. Defaults to "Previous" — override for localization. */
	label?: string;
}
