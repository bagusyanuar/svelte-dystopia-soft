import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface CardContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	/** Referensi ke elemen DOM root content */
	ref?: HTMLDivElement | null;
	children?: Snippet;
}
