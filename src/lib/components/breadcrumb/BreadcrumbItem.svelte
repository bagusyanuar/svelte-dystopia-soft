<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { BreadcrumbItemProps } from './BreadcrumbItem.types.js';

	let { class: className, children, ...restProps }: BreadcrumbItemProps = $props();
</script>

<li class={cn('inline-flex items-center gap-tight', className)} {...restProps}>
	{@render children()}
</li>
