<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { paginationNextVariants } from './PaginationNext.variants.js';
	import type { PaginationNextProps } from './PaginationNext.types.js';

	let { class: className, label, size = 'md', ...restProps }: PaginationNextProps = $props();

	const iconSize = $derived(size === 'sm' ? 'size-3.5' : 'size-4');
</script>

<button type="button" class={cn(paginationNextVariants({ size }), className)} {...restProps}>
	{label ?? 'Next'}
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
		<path d="m9 18 6-6-6-6" />
	</svg>
</button>
