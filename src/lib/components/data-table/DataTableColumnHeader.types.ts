import type { Snippet } from 'svelte';

/**
 * Structural subset of TanStack's `Column` — matches it without pinning to a
 * specific `TFeatures`/`TData` instantiation, since a real `Column` from
 * `rowSortingFeature` satisfies this shape regardless of what else the
 * consumer's table composes.
 */
export interface SortableColumn {
	getCanSort(): boolean;
	getIsSorted(): false | 'asc' | 'desc';
	getToggleSortingHandler(): ((event: unknown) => void) | undefined;
}

export interface DataTableColumnHeaderProps {
	column: SortableColumn;
	class?: string;
	children: Snippet;
}
