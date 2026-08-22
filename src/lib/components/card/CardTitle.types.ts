import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface CardTitleProps extends HTMLAttributes<HTMLDivElement> {
	class?: string;
	children: Snippet;
}
