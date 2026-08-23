import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	class?: string;
	classes?: {
		icon?: string;
		title?: string;
		description?: string;
	};
	/** Decorative — gets `aria-hidden="true"` automatically. */
	icon?: Snippet;
	title?: Snippet;
	description?: Snippet;
	/** Extra content below the description — typically a call-to-action button. */
	children?: Snippet;
}
