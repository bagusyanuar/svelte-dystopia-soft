<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardContentProps } from './CardContent.types.js';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: CardContentProps = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-content"
	class={cn('p-surface pt-0', className)}
	{...restProps}
>
	{@render children?.()}
</div>
