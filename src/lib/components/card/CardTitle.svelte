<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardTitleProps } from './CardTitle.types.js';

	let {
		as = 'div',
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: CardTitleProps = $props();
</script>

<svelte:element
	this={as}
	bind:this={ref}
	data-slot="card-title"
	class={cn('text-lg leading-tight font-semibold text-foreground', className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
