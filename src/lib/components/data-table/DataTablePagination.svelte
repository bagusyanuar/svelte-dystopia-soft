<script generics="TFeatures extends TableFeatures, TData extends RowData" lang="ts">
	import type { RowData, TableFeatures } from '@tanstack/svelte-table';
	import { cn } from '../../utils/cn.js';
	import { createIds } from '../../utils/id.js';
	import Label from '../label/Label.svelte';
	import Select from '../select/Select.svelte';
	import Pagination from '../pagination/Pagination.svelte';
	import type { DataTablePaginationProps } from './DataTablePagination.types.js';

	let {
		table,
		pageSizeOptions,
		class: className,
		classes,
		labels,
		size = 'sm',
		...restProps
	}: DataTablePaginationProps<TFeatures, TData> = $props();

	const baseId = $props.id();
	const ids = createIds(baseId, 'page-size');

	const pagination = $derived(table.atoms.pagination.get());
</script>

<div class={cn('flex flex-wrap items-center justify-between gap-cozy', className)} {...restProps}>
	<div class="flex items-center gap-tight">
		<Label for={ids['page-size']} class="font-normal">{labels?.pageSize ?? 'Rows per page'}</Label>
		<Select
			id={ids['page-size']}
			{size}
			class={cn('w-fit', classes?.pageSize)}
			classes={{ select: 'focus-visible:ring-0 focus-visible:border-ring' }}
			value={String(pagination.pageSize)}
			onchange={(event) => table.setPageSize(Number(event.currentTarget.value))}
		>
			{#each pageSizeOptions as option (option)}
				<option value={String(option)}>{option}</option>
			{/each}
		</Select>
	</div>
	<Pagination
		class={classes?.pagination}
		{size}
		{labels}
		currentPage={pagination.pageIndex + 1}
		totalPages={table.getPageCount()}
		onPageChange={(page) => table.setPageIndex(page - 1)}
	/>
</div>
