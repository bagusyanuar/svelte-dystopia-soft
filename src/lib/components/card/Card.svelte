<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardProps } from './Card.types.js';

	let {
		as = 'div',
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: CardProps = $props();
</script>

<svelte:element
	this={as}
	bind:this={ref}
	data-slot="card"
	class={cn('rounded-lg border border-border bg-surface', className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
