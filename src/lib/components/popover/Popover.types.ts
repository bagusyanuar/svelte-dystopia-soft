import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Placement } from '@floating-ui/dom';

export interface PopoverProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	classes?: {
		trigger?: string;
		content?: string;
	};
	open?: boolean;
	placement?: Placement;
	offset?: number;
	portalTarget?: HTMLElement | string;
	trigger: Snippet;
	children: Snippet;
}
