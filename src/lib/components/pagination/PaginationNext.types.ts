import type { HTMLButtonAttributes } from 'svelte/elements';

export interface PaginationNextProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	class?: string;
	/** Accessible + visible label. Defaults to "Next" — override for localization. */
	label?: string;
}
