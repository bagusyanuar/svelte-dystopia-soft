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
		'Row pagination follows the same ownership rule: compose `rowPaginationFeature` into your `tableFeatures()` call and drive the existing [`Pagination`](/docs/components-pagination--docs) component off `table.getState().pagination` / `table.setPageIndex()` — `DataTable` does not pair the two for you.'
	].join('\n');
</script>

<script lang="ts">
	import { createRawSnippet } from 'svelte';
	import {
		createColumnHelper,
		createSortedRowModel,
		createTable,
		renderComponent,
		renderSnippet,
		rowSelectionFeature,
		rowSortingFeature,
		sortFns,
		tableFeatures
	} from '@tanstack/svelte-table';
	import DataTableColumnHeader from './DataTableColumnHeader.svelte';
	import Checkbox from '../checkbox/Checkbox.svelte';

	type Invoice = { id: string; customer: string; status: string; amount: number };

	const invoices: Invoice[] = [
		{ id: 'INV001', customer: 'Ada Lovelace', status: 'Paid', amount: 250 },
		{ id: 'INV002', customer: 'Grace Hopper', status: 'Pending', amount: 150 },
		{ id: 'INV003', customer: 'Alan Turing', status: 'Unpaid', amount: 350 }
	];

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
	name="With TanStack Query"
	asChild
	parameters={{ docs: { description: { story: queryPatternDocs } } }}
>
	<div class="w-160">
		<DataTable table={basicTable} />
	</div>
</Story>
