import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	classes?: {
		trigger?: string;
		content?: string;
		indicator?: string;
		panel?: string;
	};
	ref?: HTMLDivElement | null;
	triggerRef?: HTMLButtonElement | null;
	value: string;
	disabled?: boolean;
	trigger: Snippet<[{ open: boolean }]>;
	indicator?: Snippet<[{ open: boolean }]>;
	children: Snippet<[{ open: boolean }]>;
}
