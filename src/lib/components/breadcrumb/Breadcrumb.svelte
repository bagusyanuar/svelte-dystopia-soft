<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { BreadcrumbProps } from './Breadcrumb.types.js';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: BreadcrumbProps = $props();
</script>

<nav bind:this={ref} aria-label="breadcrumb" class={cn(className)} {...restProps}>
	{@render children?.()}
</nav>
