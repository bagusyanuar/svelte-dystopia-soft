<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { PaginationEllipsisProps } from './PaginationEllipsis.types.js';

	let { class: className, children, ...restProps }: PaginationEllipsisProps = $props();
</script>

<span
	aria-hidden="true"
	class={cn('flex h-9 min-w-9 items-center justify-center text-foreground-faint', className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		&hellip;
	{/if}
</span>
