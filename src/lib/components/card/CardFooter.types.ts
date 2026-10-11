import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface CardFooterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	/** Referensi ke elemen DOM root footer */
	ref?: HTMLDivElement | null;
	children?: Snippet;
}
