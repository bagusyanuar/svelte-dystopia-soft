<script generics="TFeatures extends TableFeatures, TData extends RowData" lang="ts">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { RowData, TableFeatures } from '@tanstack/svelte-table';
	import Table from '../table/Table.svelte';
	import TableCaption from '../table/TableCaption.svelte';
	import TableHeader from '../table/TableHeader.svelte';
	import TableBody from '../table/TableBody.svelte';
	import TableRow from '../table/TableRow.svelte';
	import TableHead from '../table/TableHead.svelte';
	import TableCell from '../table/TableCell.svelte';
	import EmptyState from '../empty-state/EmptyState.svelte';
	import type { DataTableProps } from './DataTable.types.js';

	let {
		table,
		class: className,
		classes,
		labels,
		empty,
		caption,
		...restProps
	}: DataTableProps<TFeatures, TData> = $props();

	const rows = $derived(table.getRowModel().rows);
</script>

<Table class={className} classes={{ table: classes?.table }} {...restProps}>
	{#if caption}
		<TableCaption>{@render caption()}</TableCaption>
	{/if}
	<TableHeader class={classes?.header}>
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<TableRow class={classes?.row}>
				{#each headerGroup.headers as header (header.id)}
					{@const sortable = 'getCanSort' in header.column ? header.column.getCanSort() : false}
					{@const sorted = 'getIsSorted' in header.column ? header.column.getIsSorted() : false}
					<TableHead
						class={classes?.head}
						aria-sort={sortable
							? sorted === 'asc'
								? 'ascending'
								: sorted === 'desc'
									? 'descending'
									: 'none'
							: undefined}
					>
						{#if !header.isPlaceholder}
							<FlexRender {header} />
						{/if}
					</TableHead>
				{/each}
			</TableRow>
		{/each}
	</TableHeader>
	<TableBody class={classes?.body}>
		{#if rows.length === 0}
			<TableRow>
				<TableCell colspan={table.getAllColumns().length}>
					{#if empty}
						{@render empty()}
					{:else}
						<EmptyState>
							{#snippet title()}
								{labels?.empty ?? 'No data'}
							{/snippet}
						</EmptyState>
					{/if}
				</TableCell>
			</TableRow>
		{:else}
			{#each rows as row (row.id)}
				{@const cells = 'getVisibleCells' in row ? row.getVisibleCells() : row.getAllCells()}
				{@const selected = 'getIsSelected' in row ? row.getIsSelected() : false}
				<TableRow class={classes?.row} {selected}>
					{#each cells as cell (cell.id)}
						<TableCell class={classes?.cell}>
							<FlexRender {cell} />
						</TableCell>
					{/each}
				</TableRow>
			{/each}
		{/if}
	</TableBody>
</Table>
