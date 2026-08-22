import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
	class?: string;
	children: Snippet;
}
