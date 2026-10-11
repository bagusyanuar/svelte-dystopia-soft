<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { BreadcrumbItemProps } from './BreadcrumbItem.types.js';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: BreadcrumbItemProps = $props();
</script>

<li bind:this={ref} class={cn('inline-flex items-center gap-tight', className)} {...restProps}>
	{@render children?.()}
</li>
