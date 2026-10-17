<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Select from './Select.svelte';
	import Label from '../label/Label.svelte';
	import type { SelectProps } from './Select.types.js';

	type SelectStoryArgs = Pick<SelectProps, 'variant' | 'size' | 'disabled' | 'invalid'>;

	const componentDescription = [
		'Komponen input pilihan tunggal (Select) berbasis elemen native `<select>` dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Dual DOM Refs**: Mendukung `bind:ref` / `bind:selectRef` (ke elemen native `<select>`) dan `bind:containerRef` (ke elemen pembungkus terluar `<div>`).',
		'- **Granular Styling (`classes`)**: Mendukung sub-part class overrides terstruktur untuk `container`, `select`, dan `icon`.',
		'- **Custom Icon Snippet**: Mendukung snippet `icon` dengan state payload `{ disabled, invalid, value }` untuk menggantikan chevron SVG bawaan.',
		'- **State via Data-Attributes**: Mengekspos hook `data-slot="select"`, `data-slot="select-input"`, `data-slot="select-icon"`, `data-disabled`, `data-invalid`, dan `data-has-value` pada container wrapper terluar dan kontrol internal.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Select',
		component: Select,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			variant: {
				control: 'select',
				options: ['default', 'ghost'],
				description: 'Varian visual container input.'
			},
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg'],
				description: 'Ukuran dimensi kontrol select.'
			},
			disabled: {
				control: 'boolean',
				description: 'Menonaktifkan interaksi pada select.'
			},
			invalid: {
				control: 'boolean',
				description: 'Menandai status error dengan border warna bahaya dan data-invalid.'
			}
		}
	});
</script>

{#snippet fruitOptions()}
	<option value="apple">Apple</option>
	<option value="banana">Banana</option>
	<option value="cherry">Cherry</option>
	<option value="durian">Durian</option>
{/snippet}

<Story name="Default" args={{ 'aria-label': 'Fruit' }}>
	{#snippet template(args: SelectStoryArgs)}
		<Select {...args}>
			{@render fruitOptions()}
		</Select>
	{/snippet}
</Story>

<Story name="Custom icon" asChild>
	<div class="flex w-72 flex-col gap-2">
		<Label for="custom-icon-select" class="text-xs font-medium text-foreground-muted">
			Custom Icon (Single Chevron Down)
		</Label>
		<Select id="custom-icon-select" aria-label="Select fruit with custom icon">
			{#snippet icon()}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			{/snippet}
			{@render fruitOptions()}
		</Select>
	</div>
</Story>

<Story name="Custom sub-parts styling" asChild>
	<div class="flex w-80 flex-col gap-2">
		<Label for="custom-styled-select" class="text-xs font-medium text-foreground-muted">
			Custom Sub-parts (`classes.container`, `classes.select`, `classes.icon`)
		</Label>
		<Select
			id="custom-styled-select"
			aria-label="Custom styled fruit select"
			classes={{
				container: 'max-w-xs',
				select:
					'bg-surface-subtle/50 border-primary/40 text-primary font-medium focus-visible:ring-primary/30',
				icon: 'text-primary'
			}}
		>
			{@render fruitOptions()}
		</Select>
	</div>
</Story>

<Story name="Ghost" args={{ variant: 'ghost', 'aria-label': 'Fruit' }}>
	{#snippet template(args: SelectStoryArgs)}
		<Select {...args}>
			{@render fruitOptions()}
		</Select>
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-72 flex-col gap-3">
		<Select size="sm" aria-label="Fruit (small)">
			{@render fruitOptions()}
		</Select>
		<Select size="md" aria-label="Fruit (medium)">
			{@render fruitOptions()}
		</Select>
		<Select size="lg" aria-label="Fruit (large)">
			{@render fruitOptions()}
		</Select>
	</div>
</Story>

<Story name="Invalid" args={{ invalid: true, 'aria-label': 'Fruit' }}>
	{#snippet template(args: SelectStoryArgs)}
		<Select {...args}>
			{@render fruitOptions()}
		</Select>
	{/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true, 'aria-label': 'Fruit' }}>
	{#snippet template(args: SelectStoryArgs)}
		<Select {...args}>
			{@render fruitOptions()}
		</Select>
	{/snippet}
</Story>
