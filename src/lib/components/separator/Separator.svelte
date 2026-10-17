<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { separatorVariants } from './Separator.variants.js';
	import type { SeparatorProps } from './Separator.types.js';

	let {
		orientation = 'horizontal',
		decorative = true,
		ref = $bindable(null),
		class: className,
		...restProps
	}: SeparatorProps = $props();
</script>

<div
	bind:this={ref}
	role={decorative ? undefined : 'separator'}
	aria-orientation={decorative ? undefined : orientation}
	data-slot="separator"
	data-orientation={orientation}
	data-decorative={decorative ? '' : undefined}
	class={cn(separatorVariants({ orientation }), className)}
	{...restProps}
></div>
