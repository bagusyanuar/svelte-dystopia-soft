<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { PaginationListProps } from './PaginationList.types.js';

	let { class: className, children, ...restProps }: PaginationListProps = $props();
</script>

<ul class={cn('flex items-center gap-tight', className)} {...restProps}>
	{@render children()}
</ul>
