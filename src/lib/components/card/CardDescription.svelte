<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardDescriptionProps } from './CardDescription.types.js';

	let {
		as = 'div',
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: CardDescriptionProps = $props();
</script>

<svelte:element
	this={as}
	bind:this={ref}
	data-slot="card-description"
	class={cn('text-sm leading-snug text-foreground-subtle', className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
