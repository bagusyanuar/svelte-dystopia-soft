import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Placement } from '@floating-ui/dom';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'class'> {
	classes?: {
		trigger?: string;
		content?: string;
		arrow?: string;
	};
	open?: boolean;
	placement?: Placement;
	offset?: number;
	/** Hover delay in ms before the tooltip shows. Focus shows it instantly. */
	delayDuration?: number;
	showArrow?: boolean;
	portalTarget?: HTMLElement | string;
	content: Snippet;
	children: Snippet;
}
