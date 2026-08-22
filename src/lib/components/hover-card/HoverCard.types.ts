import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Placement } from '@floating-ui/dom';

export interface HoverCardProps extends Omit<
	HTMLAttributes<HTMLSpanElement>,
	'children' | 'class'
> {
	classes?: {
		trigger?: string;
		content?: string;
	};
	open?: boolean;
	placement?: Placement;
	offset?: number;
	/** Hover delay in ms before the card shows. Focus shows it instantly. */
	openDelay?: number;
	/** Grace period in ms before hiding once the pointer leaves the trigger or
	 * the card — lets it travel between the two without closing. */
	closeDelay?: number;
	portalTarget?: HTMLElement | string;
	content: Snippet;
	children: Snippet;
}
