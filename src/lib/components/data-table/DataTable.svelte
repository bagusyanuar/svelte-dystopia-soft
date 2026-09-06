<script generics="TFeatures extends TableFeatures, TData extends RowData" lang="ts">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { RowData, TableFeatures } from '@tanstack/svelte-table';
	import { cn } from '../../utils/cn.js';
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
		stickyHeader = false,
		class: className,
		classes,
		labels,
		empty,
		caption,
		expandedRow,
		...restProps
	}: DataTableProps<TFeatures, TData> = $props();

	const rows = $derived(table.getRowModel().rows);
	// `columnSizingFeature` composed means every column has a known pixel width — required
	// for a pinned column's `left`/`right` offset (below) to line up with what actually renders.
	const sizingEnabled = $derived('getCenterTotalSize' in table);

	function toggleRowExpanded(row: (typeof rows)[number]) {
		if ('toggleExpanded' in row) row.toggleExpanded();
	}

	function columnStyle(column: object, pinned: 'start' | 'end' | false) {
		const parts: string[] = [];
		if ('getSize' in column) {
			parts.push(`width: ${(column as { getSize: () => number }).getSize()}px;`);
		}
		if (pinned && 'getStart' in column) {
			const sizedColumn = column as {
				getStart: (position: 'start') => number;
				getAfter: (position: 'end') => number;
			};
			parts.push(
				pinned === 'start'
					? `left: ${sizedColumn.getStart('start')}px;`
					: `right: ${sizedColumn.getAfter('end')}px;`
			);
		}
		return parts.length ? parts.join(' ') : undefined;
	}
</script>

<Table
	class={className}
	classes={{ table: cn(classes?.table, sizingEnabled && 'table-fixed') }}
	{...restProps}
>
	{#if caption}
		<TableCaption>{@render caption()}</TableCaption>
	{/if}
	<TableHeader class={classes?.header}>
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<TableRow class={classes?.row}>
				{#each headerGroup.headers as header (header.id)}
					{@const sortable = 'getCanSort' in header.column ? header.column.getCanSort() : false}
					{@const sorted = 'getIsSorted' in header.column ? header.column.getIsSorted() : false}
					{@const pinned = 'getIsPinned' in header.column ? header.column.getIsPinned() : false}
					<TableHead
						class={cn(
							classes?.head,
							(pinned || stickyHeader) && 'sticky bg-surface-subtle',
							stickyHeader && 'top-0',
							pinned && stickyHeader ? 'z-30' : stickyHeader ? 'z-20' : pinned ? 'z-10' : undefined,
							pinned === 'start' && 'border-r border-border',
							pinned === 'end' && 'border-l border-border'
						)}
						style={columnStyle(header.column, pinned)}
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
				{@const expandable = 'getCanExpand' in row ? row.getCanExpand() : false}
				{@const expanded = expandable && 'getIsExpanded' in row ? row.getIsExpanded() : false}
				<TableRow
					class={cn(expandable && 'cursor-pointer', classes?.row)}
					{selected}
					data-expanded={expandable && expanded ? '' : undefined}
					tabindex={expandable ? 0 : undefined}
					onclick={expandable ? () => toggleRowExpanded(row) : undefined}
					onkeydown={expandable
						? (event) => {
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault();
									toggleRowExpanded(row);
								}
							}
						: undefined}
				>
					{#each cells as cell (cell.id)}
						{@const pinned = 'getIsPinned' in cell.column ? cell.column.getIsPinned() : false}
						<TableCell
							class={cn(
								classes?.cell,
								pinned && 'sticky z-10 bg-surface group-hover:bg-surface-subtle',
								pinned && selected && 'bg-surface-hover',
								pinned === 'start' && 'border-r border-border',
								pinned === 'end' && 'border-l border-border'
							)}
							style={columnStyle(cell.column, pinned)}
						>
							<FlexRender {cell} />
						</TableCell>
					{/each}
				</TableRow>
				{#if expandable && expanded && expandedRow}
					<TableRow>
						<TableCell class={classes?.cell} colspan={cells.length}>
							{@render expandedRow({ row })}
						</TableCell>
					</TableRow>
				{/if}
			{/each}
		{/if}
	</TableBody>
</Table>
