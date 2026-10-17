<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Slider from './Slider.svelte';
	import SliderInteractiveDemo from './SliderInteractiveDemo.svelte';
	import type { SliderProps } from './Slider.types.js';

	type SliderStoryArgs = Pick<SliderProps, 'value' | 'min' | 'max' | 'step' | 'size' | 'disabled'>;

	const componentDescription = [
		'Komponen input rentang nilai (Slider) berbasis native `<input type="range">` dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Native Performance & CSS Variables**: Menggunakan properti `--slider-fill` yang reaktif untuk mengisi gradien track secara dinamis tanpa layout shifting.',
		'- **Safe Style Merging**: Menggabungkan inline `style` kustom dari konsumen tanpa merusak `--slider-fill`.',
		'- **DOM Element Reference**: Mendukung `bind:ref` ke elemen native `<input type="range">`.',
		'- **Event Ergonomics (`onSlide` & `onValueChange`)**: Mendukung callback reaktif numerik `onSlide?: (value: number) => void` dan `onValueChange?: (value: number) => void` yang langsung terpicu saat slider digeser.',
		'- **State Hooks via Data-Attributes**: Mengekspos hook `data-slot="slider"`, `data-disabled`, dan `data-orientation="horizontal"`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Slider',
		component: Slider,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		args: { 'aria-label': 'Volume', min: 0, max: 100 },
		argTypes: {
			value: { control: { type: 'range', min: 0, max: 100 }, description: 'Nilai aktif slider.' },
			min: { control: 'number', description: 'Nilai minimum rentang slider.' },
			max: { control: 'number', description: 'Nilai maksimum rentang slider.' },
			step: { control: 'number', description: 'Besaran kelipatan langkah pergeseran slider.' },
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg'],
				description: 'Ukuran dimensi track dan thumb slider.'
			},
			disabled: { control: 'boolean', description: 'Menonaktifkan interaksi pada slider.' }
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

<Story name="Live increment label" asChild>
	<SliderInteractiveDemo label="Audio Volume" unit="%" value={65} min={0} max={100} />
</Story>

<Story name="With onSlide callback" asChild>
	<SliderInteractiveDemo
		label="Brightness level"
		unit="%"
		value={80}
		min={0}
		max={100}
		showBadge={true}
	/>
</Story>

<Story name="Temperature (fractional steps)" asChild>
	<SliderInteractiveDemo
		label="Thermostat"
		unit="°C"
		value={22.5}
		min={16}
		max={30}
		step={0.5}
	/>
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
