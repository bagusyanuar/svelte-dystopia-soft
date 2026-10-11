<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { buttonGroupVariants } from './ButtonGroup.variants.js';
	import type { ButtonGroupOrientation, ButtonGroupProps } from './ButtonGroup.types.js';

	let {
		orientation = 'horizontal',
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: ButtonGroupProps = $props();

	let resolvedOrientation = $derived<ButtonGroupOrientation>(orientation ?? 'horizontal');
</script>

<div
	bind:this={ref}
	role="group"
	data-orientation={resolvedOrientation}
	class={cn(buttonGroupVariants({ orientation: resolvedOrientation }), className)}
	{...restProps}
>
	{@render children?.({ orientation: resolvedOrientation })}
</div>
