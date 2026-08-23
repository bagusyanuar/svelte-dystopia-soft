<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { PaginationItemProps } from './PaginationItem.types.js';

	let { class: className, children, ...restProps }: PaginationItemProps = $props();
</script>

<li class={cn('inline-flex items-center', className)} {...restProps}>
	{@render children()}
</li>
