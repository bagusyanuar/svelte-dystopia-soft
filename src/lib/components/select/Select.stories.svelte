<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Select from './Select.svelte';
	import type { SelectProps } from './Select.types.js';

	type SelectStoryArgs = Pick<SelectProps, 'variant' | 'size' | 'disabled' | 'invalid'>;

	const { Story } = defineMeta({
		title: 'Components/Select',
		component: Select,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['default', 'ghost'] },
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			disabled: { control: 'boolean' },
			invalid: { control: 'boolean' }
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
