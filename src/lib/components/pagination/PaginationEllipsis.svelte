<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { paginationEllipsisVariants } from './PaginationEllipsis.variants.js';
	import type { PaginationEllipsisProps } from './PaginationEllipsis.types.js';

	let { class: className, size = 'md', children, ...restProps }: PaginationEllipsisProps = $props();
</script>

<span aria-hidden="true" class={cn(paginationEllipsisVariants({ size }), className)} {...restProps}>
	{#if children}
		{@render children()}
	{:else}
		&hellip;
	{/if}
</span>
