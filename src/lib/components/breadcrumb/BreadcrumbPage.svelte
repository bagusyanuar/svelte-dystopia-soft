<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { BreadcrumbPageProps } from './BreadcrumbPage.types.js';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: BreadcrumbPageProps = $props();
</script>

<span
	bind:this={ref}
	data-current=""
	aria-current="page"
	aria-disabled="true"
	class={cn('font-medium text-foreground', className)}
	{...restProps}
>
	{@render children?.()}
</span>
