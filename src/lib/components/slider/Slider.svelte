<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { sliderVariants } from './Slider.variants.js';
	import type { SliderProps } from './Slider.types.js';

	let {
		size,
		class: className,
		ref = $bindable(null),
		value = $bindable(0),
		min = 0,
		max = 100,
		disabled = false,
		...restProps
	}: SliderProps = $props();

	const fillPercentage = $derived(((value - min) / (max - min)) * 100);
</script>

<input
	type="range"
	bind:this={ref}
	bind:value
	{disabled}
	{min}
	{max}
	style="--slider-fill: {fillPercentage}%"
	class={cn(sliderVariants({ size }), className)}
	{...restProps}
/>
