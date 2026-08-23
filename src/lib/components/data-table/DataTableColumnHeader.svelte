<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { DataTableColumnHeaderProps } from './DataTableColumnHeader.types.js';

	let { column, class: className, children }: DataTableColumnHeaderProps = $props();

	const sorted = $derived(column.getIsSorted());
</script>

{#if column.getCanSort()}
	<button
		type="button"
		onclick={column.getToggleSortingHandler()}
		class={cn(
			'-mx-tight inline-flex cursor-pointer appearance-none items-center gap-tight rounded-md px-tight py-0.5 text-sm leading-snug font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
			className
		)}
	>
		{@render children()}
		{#if sorted === 'asc'}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class="size-3.5 shrink-0"
			>
				<path d="m18 15-6-6-6 6" />
			</svg>
		{:else if sorted === 'desc'}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class="size-3.5 shrink-0"
			>
				<path d="m6 9 6 6 6-6" />
			</svg>
		{:else}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class="size-3.5 shrink-0 text-foreground-faint"
			>
				<path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
			</svg>
		{/if}
	</button>
{:else}
	{@render children()}
{/if}
