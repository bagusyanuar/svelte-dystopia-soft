<script lang="ts">
	import Slider from './Slider.svelte';
	import type { SliderProps } from './Slider.types.js';

	let {
		label = 'Volume',
		unit = '%',
		value = $bindable(50),
		min = 0,
		max = 100,
		step = 1,
		size = 'md',
		disabled = false,
		showBadge = false
	}: {
		label?: string;
		unit?: string;
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		size?: SliderProps['size'];
		disabled?: boolean;
		showBadge?: boolean;
	} = $props();

	let lastSlidValue = $state<number | null>(null);
</script>

<div class="flex w-80 flex-col gap-2">
	<div class="flex items-center justify-between text-sm">
		<span class="font-medium text-foreground-soft">{label}</span>
		<div class="flex items-center gap-2">
			{#if showBadge && lastSlidValue !== null}
				<span class="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">
					onSlide: {lastSlidValue}
				</span>
			{/if}
			<span class="font-mono text-sm font-semibold tabular-nums text-foreground">
				{value}{unit}
			</span>
		</div>
	</div>

	<Slider
		bind:value
		{min}
		{max}
		{step}
		{size}
		{disabled}
		onSlide={(val) => {
			lastSlidValue = val;
		}}
		aria-label={label}
	/>
</div>
