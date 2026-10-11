<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardFooterProps } from './CardFooter.types.js';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: CardFooterProps = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-footer"
	class={cn('flex items-center gap-cozy p-surface pt-0', className)}
	{...restProps}
>
	{@render children?.()}
</div>
