import type {
	PaginationState,
	RowData,
	Table,
	TableFeatures,
	Table_RowModels_Paginated,
	Table_RowPagination
} from '@tanstack/svelte-table';
import type { PaginationLabels } from '../pagination/index.js';
import type { PaginationLinkVariantProps } from '../pagination/PaginationLink.variants.js';

export interface DataTablePaginationLabels extends PaginationLabels {
	/** Accessible name for the rows-per-page `<select>`. Defaults to "Rows per page". */
	pageSize?: string;
}

export interface DataTablePaginationProps<TFeatures extends TableFeatures, TData extends RowData> {
	/**
	 * The instance you created yourself via `createTable()` — this component never
	 * calls it internally. Must have composed `rowPaginationFeature` +
	 * `createPaginatedRowModel()` into its `features`.
	 */
	table: Table<TFeatures, TData> &
		Table_RowPagination<TFeatures, TData> &
		Table_RowModels_Paginated<TFeatures, TData> & {
			/** `TableState`'s `pagination` slice, read reactively — see `@tanstack/svelte-table`'s atoms-based state model. */
			atoms: { pagination: { get(): PaginationState } };
		};
	/** Selectable page-size values for the rows-per-page control. */
	pageSizeOptions: number[];
	class?: string;
	classes?: {
		pageSize?: string;
		pagination?: string;
	};
	labels?: DataTablePaginationLabels;
	/** Density variant, applied to both the rows-per-page select and the pagination controls. Default 'sm' — this component pairs with `DataTable`'s compact rows. */
	size?: PaginationLinkVariantProps['size'];
}
