<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { BreadcrumbListProps } from './BreadcrumbList.types.js';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: BreadcrumbListProps = $props();
</script>

<ol
	bind:this={ref}
	class={cn('flex flex-wrap items-center gap-tight text-sm text-foreground-subtle', className)}
	{...restProps}
>
	{@render children?.()}
</ol>
