import type { RowData, Table, TableFeatures } from '@tanstack/svelte-table';
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
}
