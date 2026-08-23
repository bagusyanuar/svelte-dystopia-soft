<script lang="ts">
	import { getPaginationRange } from '../../utils/pagination-range.js';
	import PaginationList from './PaginationList.svelte';
	import PaginationItem from './PaginationItem.svelte';
	import PaginationLink from './PaginationLink.svelte';
	import PaginationEllipsis from './PaginationEllipsis.svelte';
	import PaginationPrevious from './PaginationPrevious.svelte';
	import PaginationNext from './PaginationNext.svelte';
	import type { PaginationProps } from './Pagination.types.js';

	let {
		currentPage = $bindable(1),
		totalPages,
		siblingCount = 1,
		boundaryCount = 1,
		showPreviousNext = true,
		disabled = false,
		class: className,
		classes,
		labels,
		onPageChange,
		item,
		...restProps
	}: PaginationProps = $props();

	const pages = $derived(
		getPaginationRange({ currentPage, totalPages, siblingCount, boundaryCount })
	);

	function goTo(page: number): void {
		if (disabled || page < 1 || page > totalPages || page === currentPage) return;
		currentPage = page;
		onPageChange?.(page);
	}
</script>

<nav aria-label={labels?.nav ?? 'pagination'} class={className} {...restProps}>
	<PaginationList class={classes?.list}>
		{#if showPreviousNext}
			<PaginationItem>
				<PaginationPrevious
					class={classes?.previous}
					disabled={disabled || currentPage <= 1}
					label={labels?.previous}
					onclick={() => goTo(currentPage - 1)}
				/>
			</PaginationItem>
		{/if}

		{#each pages as pageItem, index (index)}
			<PaginationItem class={classes?.item}>
				{#if pageItem === 'ellipsis'}
					<PaginationEllipsis class={classes?.ellipsis} />
				{:else if item}
					{@render item({ page: pageItem, active: pageItem === currentPage })}
				{:else}
					<PaginationLink
						class={classes?.link}
						active={pageItem === currentPage}
						{disabled}
						aria-label={labels?.page?.(pageItem)}
						onclick={() => goTo(pageItem)}
					>
						{pageItem}
					</PaginationLink>
				{/if}
			</PaginationItem>
		{/each}

		{#if showPreviousNext}
			<PaginationItem>
				<PaginationNext
					class={classes?.next}
					disabled={disabled || currentPage >= totalPages}
					label={labels?.next}
					onclick={() => goTo(currentPage + 1)}
				/>
			</PaginationItem>
		{/if}
	</PaginationList>
</nav>
