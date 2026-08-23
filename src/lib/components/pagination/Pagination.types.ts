import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface PaginationLabels {
	/** Accessible name for the root `<nav>`. Defaults to "pagination". */
	nav?: string;
	previous?: string;
	next?: string;
	/** Accessible name for a page button beyond its visible number, e.g. `(page) => `Go to page ${page}`` */
	page?: (page: number) => string;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	/** 1-indexed. */
	currentPage?: number;
	totalPages: number;
	/** Pages kept on each side of the current page. Default 1. */
	siblingCount?: number;
	/** Pages kept at the very start and very end. Default 1. */
	boundaryCount?: number;
	/** Default true. */
	showPreviousNext?: boolean;
	disabled?: boolean;
	class?: string;
	classes?: {
		list?: string;
		item?: string;
		link?: string;
		ellipsis?: string;
		previous?: string;
		next?: string;
	};
	labels?: PaginationLabels;
	onPageChange?: (page: number) => void;
	/** Overrides the default rendering of a page-number item. Doesn't apply to the ellipsis, previous, or next controls. */
	item?: Snippet<[{ page: number; active: boolean }]>;
}
