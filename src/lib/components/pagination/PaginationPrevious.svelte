<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { paginationPreviousVariants } from './PaginationPrevious.variants.js';
	import type { PaginationPreviousProps } from './PaginationPrevious.types.js';

	let { class: className, label, size = 'md', ...restProps }: PaginationPreviousProps = $props();

	const iconSize = $derived(size === 'sm' ? 'size-3.5' : 'size-4');
</script>

<button type="button" class={cn(paginationPreviousVariants({ size }), className)} {...restProps}>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={iconSize}
	>
		<path d="m15 18-6-6 6-6" />
	</svg>
	{label ?? 'Previous'}
</button>
