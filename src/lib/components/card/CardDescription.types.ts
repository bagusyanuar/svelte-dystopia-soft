import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface CardDescriptionProps extends HTMLAttributes<HTMLDivElement> {
	class?: string;
	children: Snippet;
}
