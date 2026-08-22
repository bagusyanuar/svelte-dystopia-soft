<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Slider from './Slider.svelte';
	import type { SliderProps } from './Slider.types.js';

	type SliderStoryArgs = Pick<SliderProps, 'value' | 'min' | 'max' | 'step' | 'size' | 'disabled'>;

	const { Story } = defineMeta({
		title: 'Components/Slider',
		component: Slider,
		tags: ['autodocs'],
		args: { 'aria-label': 'Volume', min: 0, max: 100 },
		argTypes: {
			value: { control: { type: 'range', min: 0, max: 100 } },
			min: { control: 'number' },
			max: { control: 'number' },
			step: { control: 'number' },
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			disabled: { control: 'boolean' }
		}
	});
</script>

<Story name="Default" args={{ value: 40 }}>
	{#snippet template(args: SliderStoryArgs)}
		<div class="w-72">
			<Slider {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Stepped" args={{ value: 40, step: 10 }}>
	{#snippet template(args: SliderStoryArgs)}
		<div class="w-72">
			<Slider {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-72 flex-col gap-6">
		<Slider size="sm" value={40} min={0} max={100} aria-label="Small" />
		<Slider size="md" value={40} min={0} max={100} aria-label="Medium" />
		<Slider size="lg" value={40} min={0} max={100} aria-label="Large" />
	</div>
</Story>

<Story name="Disabled" args={{ value: 40, disabled: true }}>
	{#snippet template(args: SliderStoryArgs)}
		<div class="w-72">
			<Slider {...args} />
		</div>
	{/snippet}
</Story>

<Story name="With a value label" asChild>
	<div class="flex w-72 flex-col gap-1.5">
		<div class="flex items-center justify-between text-sm text-foreground-soft">
			<span>Volume</span>
			<span>65%</span>
		</div>
		<Slider value={65} min={0} max={100} aria-label="Volume" />
	</div>
</Story>
