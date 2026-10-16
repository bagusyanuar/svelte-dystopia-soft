import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

export interface DropdownItemChildProps {
	props: Record<string, unknown>;
}

export interface DropdownItemProps
	extends Omit<HTMLButtonAttributes & HTMLAnchorAttributes, 'children' | 'class'> {
	/** Consumer class override for the menuitem element. */
	class?: string;
	/** Bindable ref to the menuitem element (`<button>` or `<a>`). */
	ref?: HTMLElement | null;
	/** If provided, renders an `<a>` element instead of a `<button>`. */
	href?: string;
	/** Whether the item is disabled. */
	disabled?: boolean;
	/** Callback invoked when the item is activated. */
	onSelect?: () => void;
	/** Optional child snippet for custom element replacement (asChild pattern). */
	child?: Snippet<[DropdownItemChildProps]>;
	/** Item content snippet. */
	children?: Snippet;
}
