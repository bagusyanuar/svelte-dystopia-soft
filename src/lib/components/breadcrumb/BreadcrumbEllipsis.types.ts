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
	/** Popover content — typically the collapsed `BreadcrumbLink`/`BreadcrumbItem`s. */
	children: Snippet;
}
