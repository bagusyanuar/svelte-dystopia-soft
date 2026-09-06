import type { Row, RowData, Table, TableFeatures } from '@tanstack/svelte-table';
import type { Snippet } from 'svelte';
import type { HTMLTableAttributes } from 'svelte/elements';

export interface DataTableLabels {
	/** Announced when there are no rows. Defaults to "No data". */
	empty?: string;
}

export interface DataTableProps<
	TFeatures extends TableFeatures,
	TData extends RowData
> extends HTMLTableAttributes {
	/** The instance you created yourself via `createTable()` — this component never calls it internally. */
	table: Table<TFeatures, TData>;
	/**
	 * Sticks the header row to the top of the nearest scrolling ancestor —
	 * pair with a bounded-height wrapper (e.g. `class="max-h-96 overflow-y-auto"`).
	 * Frozen columns need no prop here: composing `columnPinningFeature` (and
	 * `columnSizingFeature`, for correct offsets when more than one column is
	 * pinned per side) on your own `table` makes `getIsPinned()` columns sticky
	 * automatically, same as sorting/selection/expanding above.
	 */
	stickyHeader?: boolean;
	class?: string;
	classes?: {
		table?: string;
		header?: string;
		body?: string;
		row?: string;
		head?: string;
		cell?: string;
	};
	labels?: DataTableLabels;
	/** Overrides the default `EmptyState` row shown when `table.getRowModel().rows` is empty. */
	empty?: Snippet;
	caption?: Snippet;
	/**
	 * Rendered as a full-width row beneath any row where `row.getIsExpanded()` is true.
	 * Requires the consumer's `table` to compose `rowExpandingFeature` — a row without
	 * `getCanExpand()` is rendered exactly as before, click-to-expand included.
	 */
	expandedRow?: Snippet<[{ row: Row<TFeatures, TData> }]>;
}
