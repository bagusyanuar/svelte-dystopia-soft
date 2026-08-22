<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Radio from './Radio.svelte';
	import Label from '../label/Label.svelte';
	import type { RadioProps } from './Radio.types.js';

	type RadioStoryArgs = Pick<RadioProps, 'value' | 'size' | 'disabled' | 'invalid'>;

	const { Story } = defineMeta({
		title: 'Components/Radio',
		component: Radio,
		tags: ['autodocs'],
		args: { value: 'option', 'aria-label': 'Option' },
		argTypes: {
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			disabled: { control: 'boolean' },
			invalid: { control: 'boolean' }
		}
	});
</script>

<Story name="Default">
	{#snippet template(args: RadioStoryArgs)}
		<Radio {...args} />
	{/snippet}
</Story>

<Story name="Checked" asChild>
	<Radio value="option" group="option" aria-label="Option" />
</Story>

<Story name="Sizes" asChild>
	<div class="flex items-center gap-3">
		<Radio size="sm" value="sm" group="sm" aria-label="Small" />
		<Radio size="md" value="md" group="md" aria-label="Medium" />
		<Radio size="lg" value="lg" group="lg" aria-label="Large" />
	</div>
</Story>

<Story name="Invalid" args={{ invalid: true }}>
	{#snippet template(args: RadioStoryArgs)}
		<Radio {...args} />
	{/snippet}
</Story>

<Story name="Disabled" asChild>
	<div class="flex items-center gap-3">
		<Radio value="off" disabled aria-label="Disabled" />
		<Radio value="on" group="on" disabled aria-label="Disabled and checked" />
	</div>
</Story>

<Story name="With a label" asChild>
	<div class="flex items-center gap-2">
		<Radio id="radio-free" name="plan" value="free" />
		<Label for="radio-free">Free</Label>
	</div>
</Story>

<Story name="Group" asChild>
	<fieldset class="flex flex-col gap-3">
		<legend class="mb-2 text-sm font-medium text-foreground-soft">Plan</legend>
		<div class="flex items-center gap-2">
			<Radio id="plan-free" name="plan" value="free" />
			<Label for="plan-free">Free</Label>
		</div>
		<div class="flex items-center gap-2">
			<Radio id="plan-pro" name="plan" value="pro" group="pro" />
			<Label for="plan-pro">Pro</Label>
		</div>
		<div class="flex items-center gap-2">
			<Radio id="plan-enterprise" name="plan" value="enterprise" />
			<Label for="plan-enterprise">Enterprise</Label>
		</div>
	</fieldset>
</Story>
