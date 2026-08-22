import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
	class?: string;
	children: Snippet;
}
