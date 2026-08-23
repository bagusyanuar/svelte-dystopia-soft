import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface TableCaptionProps extends HTMLAttributes<HTMLElement> {
	class?: string;
	children: Snippet;
}
