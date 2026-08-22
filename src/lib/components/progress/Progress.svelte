<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { progressVariants } from './Progress.variants.js';
	import type { ProgressProps } from './Progress.types.js';

	let {
		size,
		class: className,
		classes,
		value = 0,
		max = 100,
		indeterminate = false,
		...restProps
	}: ProgressProps = $props();

	const percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
</script>

<div
	role="progressbar"
	aria-valuenow={indeterminate ? undefined : value}
	aria-valuemin={0}
	aria-valuemax={max}
	class={cn(progressVariants({ size }), className)}
	{...restProps}
>
	<div
		class={cn(
			'h-full rounded-full bg-primary transition-[width] duration-300 ease-out',
			indeterminate && 'w-1/3 animate-progress-indeterminate',
			classes?.fill
		)}
		style={indeterminate ? undefined : `width: ${percentage}%`}
	></div>
</div>
