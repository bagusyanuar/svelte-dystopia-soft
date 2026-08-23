<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { separatorVariants } from './Separator.variants.js';
	import type { SeparatorProps } from './Separator.types.js';

	let {
		orientation = 'horizontal',
		decorative = true,
		class: className,
		...restProps
	}: SeparatorProps = $props();
</script>

<div
	role={decorative ? undefined : 'separator'}
	aria-orientation={decorative ? undefined : orientation}
	class={cn(separatorVariants({ orientation }), className)}
	{...restProps}
></div>
