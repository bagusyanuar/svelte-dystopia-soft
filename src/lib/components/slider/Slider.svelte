<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { sliderVariants } from './Slider.variants.js';
	import type { SliderProps } from './Slider.types.js';

	let {
		size,
		class: className,
		style: styleProp,
		ref = $bindable(null),
		value = $bindable(0),
		min = 0,
		max = 100,
		disabled = false,
		onValueChange,
		onSlide,
		oninput,
		...restProps
	}: SliderProps = $props();

	const fillPercentage = $derived(
		max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0
	);

	const computedStyle = $derived(
		`--slider-fill: ${fillPercentage}%;${styleProp ? ` ${styleProp}` : ''}`
	);

	function handleInput(event: Event & { currentTarget: HTMLInputElement }): void {
		const numericValue = Number(event.currentTarget.value);
		oninput?.(event);
		onValueChange?.(numericValue);
		onSlide?.(numericValue);
	}
</script>

<input
	type="range"
	bind:this={ref}
	bind:value
	{disabled}
	{min}
	{max}
	style={computedStyle}
	data-slot="slider"
	data-disabled={disabled ? '' : undefined}
	data-orientation="horizontal"
	class={cn(sliderVariants({ size }), className)}
	oninput={handleInput}
	{...restProps}
/>
