import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	classes?: {
		trigger?: string;
		content?: string;
	};
	value: string;
	disabled?: boolean;
	trigger: Snippet;
	children: Snippet;
}
