import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface CollapsibleSnippetProps {
	open: boolean;
}

export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	classes?: {
		trigger?: string;
		content?: string;
		indicator?: string;
		panel?: string;
	};
	/** Bindable ref to the outer wrapper `<div>`. */
	ref?: HTMLDivElement | null;
	/** Bindable ref to the trigger `<button>` element. */
	triggerRef?: HTMLButtonElement | null;
	open?: boolean;
	disabled?: boolean;
	/** Trigger snippet accepting the `{ open }` state payload. */
	trigger: Snippet<[CollapsibleSnippetProps]>;
	/** Optional indicator snippet to replace the default chevron SVG. */
	indicator?: Snippet<[CollapsibleSnippetProps]>;
	/** Content snippet accepting the `{ open }` state payload. */
	children?: Snippet<[CollapsibleSnippetProps]>;
}
