<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import NumberField from './NumberField.svelte';
	import type { NumberFieldProps } from './NumberField.types.js';

	type NumberFieldStoryArgs = Pick<
		NumberFieldProps,
		| 'variant'
		| 'size'
		| 'placeholder'
		| 'disabled'
		| 'invalid'
		| 'hideSpinner'
		| 'thousandSeparator'
		| 'min'
		| 'max'
		| 'step'
	>;

	const { Story } = defineMeta({
		title: 'Components/NumberField',
		component: NumberField,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['default', 'ghost'] },
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			disabled: { control: 'boolean' },
			invalid: { control: 'boolean' },
			hideSpinner: { control: 'boolean' },
			thousandSeparator: { control: 'boolean' }
		}
	});
</script>

<Story name="Default" args={{ placeholder: 'Quantity' }}>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} />
	{/snippet}
</Story>

<Story name="With initial value" args={{ placeholder: 'Quantity' }}>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={42} />
	{/snippet}
</Story>

<Story name="Min, max and step" args={{ placeholder: '0-100', min: 0, max: 100, step: 5 }}>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={10} />
	{/snippet}
</Story>

<Story name="Spinner visible" args={{ placeholder: 'Quantity', hideSpinner: false }}>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={1} />
	{/snippet}
</Story>

<Story name="Thousand separator" args={{ placeholder: 'Amount', thousandSeparator: true }}>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={1234567.89} />
	{/snippet}
</Story>

<Story name="Currency (IDR)" args={{ placeholder: '0', thousandSeparator: true }}>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={1500000}>
			{#snippet prefix()}<span class="text-sm text-foreground-subtle">Rp</span>{/snippet}
		</NumberField>
	{/snippet}
</Story>

<Story name="Currency (USD)" args={{ placeholder: '0.00', thousandSeparator: true }}>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={1999.99}>
			{#snippet prefix()}<span class="text-sm text-foreground-subtle">$</span>{/snippet}
		</NumberField>
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-72 flex-col gap-3">
		<NumberField size="sm" placeholder="Small" />
		<NumberField size="md" placeholder="Medium" />
		<NumberField size="lg" placeholder="Large" />
	</div>
</Story>

<Story name="Invalid" args={{ invalid: true, placeholder: 'Quantity' }}>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={-5} />
	{/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true, placeholder: 'Quantity' }}>
	{#snippet template(args: NumberFieldStoryArgs)}
		<NumberField {...args} value={10} />
	{/snippet}
</Story>
