import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Placement } from '@floating-ui/dom';

export interface BreadcrumbEllipsisProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	classes?: {
		trigger?: string;
		content?: string;
	};
	open?: boolean;
	placement?: Placement;
	labels?: { more?: string };
	/** Custom trigger icon or snippet, replaces the default 3-dots icon */
	trigger?: Snippet<[{ open: boolean }]>;
	/** Popover content — typically the collapsed `BreadcrumbLink`/`BreadcrumbItem`s. */
	children: Snippet;
}
