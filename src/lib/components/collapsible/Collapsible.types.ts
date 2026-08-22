import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	classes?: {
		trigger?: string;
		content?: string;
	};
	open?: boolean;
	disabled?: boolean;
	trigger: Snippet;
	children: Snippet;
}
