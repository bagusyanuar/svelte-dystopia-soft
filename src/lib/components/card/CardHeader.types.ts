import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	/** Referensi ke elemen DOM root header */
	ref?: HTMLDivElement | null;
	children?: Snippet;
}
