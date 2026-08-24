<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DataTable from './DataTable.svelte';

	const { Story } = defineMeta({
		title: 'Components/DataTable',
		component: DataTable,
		tags: ['autodocs']
	});

	// Rendered into the Storybook docs page via `parameters.docs.description.story`
	// on the "With TanStack Query" story below — a plain source comment wouldn't
	// show up there. Built as joined lines (rather than one template literal) so
	// none of the embedded code needs its backticks escaped. Doc-only, same as
	// Combobox's `asyncPatternDocs` — no `@tanstack/svelte-query` dependency is
	// added just for this demo.
	const queryPatternDocs = [
		'`DataTable` never calls `createTable()` and never fetches anything itself — you own both, exactly like every other story on this page. The only thing that changes when the data comes from a server is what feeds the `data` getter. Here it is paired with [@tanstack/svelte-query](https://tanstack.com/query/latest/docs/framework/svelte/overview).',
		'',
		'```svelte',
		'// instance script',
		"import { createQuery } from '@tanstack/svelte-query';",
		"import { createColumnHelper, createTable, tableFeatures } from '@tanstack/svelte-table';",
		"import { DataTable } from '@dystopia/soft-lib/components/data-table';",
		'',
		'type Invoice = { id: string; customer: string; amount: number };',
		'',
		'const invoicesQuery = createQuery(() => ({',
		"\tqueryKey: ['invoices'],",
		'\tqueryFn: fetchInvoices',
		'}));',
		'',
		'const features = tableFeatures({});',
		'const columnHelper = createColumnHelper<typeof features, Invoice>();',
		'const columns = columnHelper.columns([',
		"\tcolumnHelper.accessor('id', { header: 'Invoice' }),",
		"\tcolumnHelper.accessor('customer', { header: 'Customer' }),",
		"\tcolumnHelper.accessor('amount', { header: 'Amount' })",
		']);',
		'',
		'const table = createTable({',
		'\tfeatures,',
		'\tcolumns,',
		'\t// Must be a getter, not a plain value — `createTable` syncs options in',
		'\t// `$effect.pre`, so it needs to read the *current* query result on every',
		'\t// pass, not the snapshot captured when `createTable` first ran.',
		'\tget data() {',
		'\t\treturn invoicesQuery.data ?? [];',
		'\t}',
		'});',
		'',
		'// markup',
		'<DataTable {table}>',
		'\t{#snippet empty()}',
		'\t\t{#if invoicesQuery.isPending}',
		'\t\t\t<Spinner label="Loading invoices" />',
		'\t\t{:else if invoicesQuery.isError}',
		'\t\t\t<p>Failed to load invoices.</p>',
		'\t\t{:else}',
		'\t\t\t<p>No invoices yet.</p>',
		'\t\t{/if}',
		'\t{/snippet}',
		'</DataTable>',
		'```',
		'',
		"`DataTable` has no `loading` prop by design (see the component roadmap) — it stays a thin renderer over whatever `table.getRowModel().rows` currently holds. While a query is pending, that row model is simply empty, so the `empty` snippet is what carries loading/error/empty-for-real state; branch on the query's own flags there like above, rather than reaching for a prop that doesn't exist.",
		'',
		'Row pagination follows the same ownership rule: compose `rowPaginationFeature` + `createPaginatedRowModel()` into your `tableFeatures()` call, then hand the same `table` instance to `DataTablePagination` — `DataTable` does not pair the two for you. See the "With pagination" story on this page.'
	].join('\n');
</script>

<script lang="ts">
	import { createRawSnippet } from 'svelte';
	import {
		createColumnHelper,
		createExpandedRowModel,
		createPaginatedRowModel,
		createSortedRowModel,
		createTable,
		renderComponent,
		renderSnippet,
		rowExpandingFeature,
		rowPaginationFeature,
		rowSelectionFeature,
		rowSortingFeature,
		sortFns,
		tableFeatures
	} from '@tanstack/svelte-table';
	import DataTableColumnHeader from './DataTableColumnHeader.svelte';
	import DataTablePagination from './DataTablePagination.svelte';
	import Checkbox from '../checkbox/Checkbox.svelte';

	type Invoice = { id: string; customer: string; status: string; amount: number };

	const invoices: Invoice[] = [
		{ id: 'INV001', customer: 'Ada Lovelace', status: 'Paid', amount: 250 },
		{ id: 'INV002', customer: 'Grace Hopper', status: 'Pending', amount: 150 },
		{ id: 'INV003', customer: 'Alan Turing', status: 'Unpaid', amount: 350 }
	];

	const manyInvoices: Invoice[] = Array.from({ length: 23 }, (_, i) => ({
		id: `INV${String(i + 1).padStart(3, '0')}`,
		customer: ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson'][i % 4],
		status: ['Paid', 'Pending', 'Unpaid'][i % 3],
		amount: 100 + i * 25
	}));

	function label(text: string) {
		return createRawSnippet(() => ({ render: () => `<span>${text}</span>` }));
	}

	function srOnlyLabel(text: string) {
		return createRawSnippet(() => ({ render: () => `<span class="sr-only">${text}</span>` }));
	}

	const basicFeatures = tableFeatures({});
	const basicColumnHelper = createColumnHelper<typeof basicFeatures, Invoice>();
	const basicColumns = basicColumnHelper.columns([
		basicColumnHelper.accessor('id', { header: 'Invoice' }),
		basicColumnHelper.accessor('customer', { header: 'Customer' }),
		basicColumnHelper.accessor('status', { header: 'Status' }),
		basicColumnHelper.accessor('amount', {
			header: 'Amount',
			cell: (ctx) => `$${ctx.getValue()}.00`
		})
	]);
	const basicTable = createTable({
		features: basicFeatures,
		columns: basicColumns,
		get data() {
			return invoices;
		}
	});

	const emptyTable = createTable({
		features: basicFeatures,
		columns: basicColumns,
		get data() {
			return [] as Invoice[];
		}
	});

	const sortableFeatures = tableFeatures({
		rowSortingFeature,
		sortedRowModel: createSortedRowModel(),
		sortFns
	});
	const sortableColumnHelper = createColumnHelper<typeof sortableFeatures, Invoice>();
	const sortableColumns = sortableColumnHelper.columns([
		sortableColumnHelper.accessor('id', { header: 'Invoice', enableSorting: false }),
		sortableColumnHelper.accessor('customer', {
			header: (ctx) =>
				renderComponent(DataTableColumnHeader, { column: ctx.column, children: label('Customer') }),
			sortFn: 'alphanumeric'
		}),
		sortableColumnHelper.accessor('status', {
			header: (ctx) =>
				renderComponent(DataTableColumnHeader, { column: ctx.column, children: label('Status') }),
			sortFn: 'alphanumeric'
		}),
		sortableColumnHelper.accessor('amount', {
			header: (ctx) =>
				renderComponent(DataTableColumnHeader, { column: ctx.column, children: label('Amount') }),
			sortFn: 'basic',
			cell: (ctx) => `$${ctx.getValue()}.00`
		})
	]);
	const sortableTable = createTable({
		features: sortableFeatures,
		columns: sortableColumns,
		get data() {
			return invoices;
		}
	});

	const selectableFeatures = tableFeatures({ rowSelectionFeature });
	const selectableColumnHelper = createColumnHelper<typeof selectableFeatures, Invoice>();
	const selectableColumns = selectableColumnHelper.columns([
		selectableColumnHelper.display({
			id: 'select',
			header: () => renderSnippet(srOnlyLabel('Select')),
			cell: (ctx) =>
				renderComponent(Checkbox, {
					checked: ctx.row.getIsSelected(),
					onchange: () => ctx.row.toggleSelected(),
					'aria-label': `Select row ${ctx.row.index + 1}`
				})
		}),
		selectableColumnHelper.accessor('id', { header: 'Invoice' }),
		selectableColumnHelper.accessor('customer', { header: 'Customer' }),
		selectableColumnHelper.accessor('status', { header: 'Status' })
	]);
	const selectableTable = createTable({
		features: selectableFeatures,
		columns: selectableColumns,
		get data() {
			return invoices;
		}
	});

	const expandableFeatures = tableFeatures({
		rowExpandingFeature,
		expandedRowModel: createExpandedRowModel()
	});
	const expandableColumnHelper = createColumnHelper<typeof expandableFeatures, Invoice>();
	const expandableColumns = expandableColumnHelper.columns([
		expandableColumnHelper.accessor('id', { header: 'Invoice' }),
		expandableColumnHelper.accessor('customer', { header: 'Customer' }),
		expandableColumnHelper.accessor('status', { header: 'Status' }),
		expandableColumnHelper.accessor('amount', {
			header: 'Amount',
			cell: (ctx) => `$${ctx.getValue()}.00`
		})
	]);
	const expandableTable = createTable({
		features: expandableFeatures,
		columns: expandableColumns,
		getRowCanExpand: () => true,
		get data() {
			return invoices;
		}
	});

	const paginatedFeatures = tableFeatures({
		rowPaginationFeature,
		paginatedRowModel: createPaginatedRowModel()
	});
	const paginatedColumnHelper = createColumnHelper<typeof paginatedFeatures, Invoice>();
	const paginatedColumns = paginatedColumnHelper.columns([
		paginatedColumnHelper.accessor('id', { header: 'Invoice' }),
		paginatedColumnHelper.accessor('customer', { header: 'Customer' }),
		paginatedColumnHelper.accessor('status', { header: 'Status' }),
		paginatedColumnHelper.accessor('amount', {
			header: 'Amount',
			cell: (ctx) => `$${ctx.getValue()}.00`
		})
	]);
	const paginatedTable = createTable({
		features: paginatedFeatures,
		columns: paginatedColumns,
		get data() {
			return manyInvoices;
		},
		initialState: { pagination: { pageIndex: 0, pageSize: 5 } }
	});
</script>

<Story name="Default" asChild>
	<div class="w-160">
		<DataTable table={basicTable} />
	</div>
</Story>

<Story name="Empty" asChild>
	<div class="w-160">
		<DataTable table={emptyTable} labels={{ empty: 'No invoices yet' }} />
	</div>
</Story>

<Story
	name="Sortable"
	asChild
	parameters={{
		docs: {
			description: {
				story:
					"Sorting is entirely the consumer's: this table composes `rowSortingFeature` + `createSortedRowModel()` itself via `createTable()`. `DataTable` never calls `createTable` internally — it only renders whatever instance you hand it. `DataTableColumnHeader` is an optional convenience for the sort button + indicator; a plain header string works too, like the `Invoice` column here (`enableSorting: false`)."
			}
		}
	}}
>
	<div class="w-160">
		<DataTable table={sortableTable}>
			{#snippet caption()}Click "Customer", "Status", or "Amount" to sort.{/snippet}
		</DataTable>
	</div>
</Story>

<Story
	name="Selectable rows"
	asChild
	parameters={{
		docs: {
			description: {
				story:
					'`DataTable` owns no selection state — the `select` column here is entirely defined by the consumer, reusing the existing `Checkbox` component via `renderComponent`. Row highlight (`data-selected`) still comes for free from `row.getIsSelected()`.'
			}
		}
	}}
>
	<div class="w-160">
		<DataTable table={selectableTable} />
	</div>
</Story>

<Story
	name="Expandable rows"
	asChild
	parameters={{
		docs: {
			description: {
				story:
					"`DataTable` owns no expanding state — this table composes `rowExpandingFeature` + `createExpandedRowModel()` itself via `createTable()`, and sets `getRowCanExpand: () => true` so every row qualifies. Instead of a dedicated toggle button, `DataTable` makes the whole row clickable (and focusable/Enter-Space-able) whenever `row.getCanExpand()` is true, toggling `row.toggleExpanded()`; the `expandedRow` snippet then renders as a full-width row beneath it while `row.getIsExpanded()` is true. A row from a table without the expanding feature composed (every other story on this page) is left exactly as before — not focusable, not clickable."
			}
		}
	}}
>
	<div class="w-160">
		<DataTable table={expandableTable}>
			{#snippet expandedRow({ row })}
				<div class="px-compact py-2 text-sm text-foreground-subtle">
					Full details for {row.original.customer}'s invoice {row.original.id}.
				</div>
			{/snippet}
		</DataTable>
	</div>
</Story>

<Story
	name="With pagination"
	asChild
	parameters={{
		docs: {
			description: {
				story:
					"`DataTable` does not pair with pagination for you — this table composes `rowPaginationFeature` + `createPaginatedRowModel()` itself via `createTable()`, and `DataTablePagination` is handed the same `table` instance: it renders a rows-per-page `Select` (calling `table.setPageSize()`, which recomputes `pageIndex` itself so the current top row stays in view) alongside `Pagination` (`currentPage`/`totalPages`/`onPageChange` wired to `table.atoms.pagination` / `table.getPageCount()` / `table.setPageIndex()`). Same ownership rule as sorting and selection above — `DataTable` owns none of this state, and `DataTablePagination` is purely a convenience composition, not a new state owner. Its `size` defaults to `'sm'` to match `DataTable`'s row density; pass `size='md'` or `'lg'` for a roomier layout, or skip `DataTablePagination` and compose `Pagination` + `Select` yourself for full control over the layout."
			}
		}
	}}
>
	<div class="flex w-200 flex-col gap-cozy">
		<DataTable table={paginatedTable} />
		<DataTablePagination table={paginatedTable} pageSizeOptions={[5, 10, 20]} />
	</div>
</Story>

<Story
	name="With TanStack Query"
	asChild
	parameters={{ docs: { description: { story: queryPatternDocs } } }}
>
	<div class="w-160">
		<DataTable table={basicTable} />
	</div>
</Story>
