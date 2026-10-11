<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardHeaderProps } from './CardHeader.types.js';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: CardHeaderProps = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-header"
	class={cn('flex flex-col gap-1.5 p-surface', className)}
	{...restProps}
>
	{@render children?.()}
</div>
