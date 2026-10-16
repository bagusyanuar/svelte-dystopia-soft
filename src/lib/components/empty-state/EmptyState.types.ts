import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface EmptyStateClasses {
	icon?: string;
	title?: string;
	description?: string;
	actions?: string;
}

export interface EmptyStateProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'title' | 'children'
> {
	/** Consumer class override for the root container element. */
	class?: string;
	/** Fine-grained sub-part class overrides. */
	classes?: EmptyStateClasses;
	/** Bindable ref to the root `<div>` element. */
	ref?: HTMLDivElement | null;
	/** Decorative icon snippet — rendered with `aria-hidden="true"` automatically. */
	icon?: Snippet;
	/** Title snippet for the main empty state heading. */
	title?: Snippet;
	/** Description snippet for the supportive body text. */
	description?: Snippet;
	/** Extra content below the description — typically call-to-action button(s). */
	children?: Snippet;
}
