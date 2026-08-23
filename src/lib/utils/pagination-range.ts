export interface PaginationRangeOptions {
	currentPage: number;
	totalPages: number;
	/** Pages kept on each side of the current page. */
	siblingCount?: number;
	/** Pages kept at the very start and very end. */
	boundaryCount?: number;
}

export type PaginationRangeItem = number | 'ellipsis';

/**
 * Computes which page numbers to show, collapsing the rest into `'ellipsis'`
 * markers — e.g. `1 2 3 … 10` or `1 … 6 7 8 … 25`. Builds the wanted page set
 * (boundary pages + pages around the current page) first, then walks 1..N
 * once inserting an ellipsis wherever there's a gap, rather than juggling
 * boundary math with conditional expressions — easier to verify correct at
 * the edges (small totalPages, current page at either end).
 */
export function getPaginationRange({
	currentPage,
	totalPages,
	siblingCount = 1,
	boundaryCount = 1
}: PaginationRangeOptions): PaginationRangeItem[] {
	if (totalPages <= 0) return [];

	const current = Math.min(Math.max(1, currentPage), totalPages);

	const wanted = new Set<number>();
	for (let page = 1; page <= Math.min(boundaryCount, totalPages); page++) {
		wanted.add(page);
	}
	for (let page = Math.max(1, totalPages - boundaryCount + 1); page <= totalPages; page++) {
		wanted.add(page);
	}
	for (
		let page = Math.max(1, current - siblingCount);
		page <= Math.min(totalPages, current + siblingCount);
		page++
	) {
		wanted.add(page);
	}

	const items: PaginationRangeItem[] = [];
	let previous = 0;
	for (let page = 1; page <= totalPages; page++) {
		if (!wanted.has(page)) continue;
		if (page - previous > 1) items.push('ellipsis');
		items.push(page);
		previous = page;
	}

	return items;
}
