<script lang="ts">
	import Slider from './Slider.svelte';

	let {
		value = $bindable(25),
		disabled = false,
		onValueChange = undefined,
		onSlide = undefined
	}: {
		value?: number;
		disabled?: boolean;
		onValueChange?: (val: number) => void;
		onSlide?: (val: number) => void;
	} = $props();

	let inputRef = $state<HTMLInputElement | null>(null);
</script>

<Slider
	bind:ref={inputRef}
	bind:value
	{disabled}
	{onValueChange}
	{onSlide}
	min={0}
	max={100}
	aria-label="Volume Slider"
	data-testid="harness-slider"
/>

<span data-testid="has-ref">{inputRef ? 'yes' : 'no'}</span>
<output data-testid="outer-value">{value}</output>
