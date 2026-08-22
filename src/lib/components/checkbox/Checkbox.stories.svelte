<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Checkbox from './Checkbox.svelte';
	import Label from '../label/Label.svelte';
	import type { CheckboxProps } from './Checkbox.types.js';

	type CheckboxStoryArgs = Pick<
		CheckboxProps,
		'size' | 'checked' | 'indeterminate' | 'disabled' | 'invalid'
	>;

	const { Story } = defineMeta({
		title: 'Components/Checkbox',
		component: Checkbox,
		tags: ['autodocs'],
		args: { 'aria-label': 'Accept terms' },
		argTypes: {
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			checked: { control: 'boolean' },
			indeterminate: { control: 'boolean' },
			disabled: { control: 'boolean' },
			invalid: { control: 'boolean' }
		}
	});
</script>

<Story name="Default">
	{#snippet template(args: CheckboxStoryArgs)}
		<Checkbox {...args} />
	{/snippet}
</Story>

<Story name="Checked" args={{ checked: true }}>
	{#snippet template(args: CheckboxStoryArgs)}
		<Checkbox {...args} />
	{/snippet}
</Story>

<Story name="Indeterminate" args={{ indeterminate: true }}>
	{#snippet template(args: CheckboxStoryArgs)}
		<Checkbox {...args} />
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex items-center gap-3">
		<Checkbox size="sm" checked aria-label="Small" />
		<Checkbox size="md" checked aria-label="Medium" />
		<Checkbox size="lg" checked aria-label="Large" />
	</div>
</Story>

<Story name="Invalid" args={{ invalid: true }}>
	{#snippet template(args: CheckboxStoryArgs)}
		<Checkbox {...args} />
	{/snippet}
</Story>

<Story name="Disabled" asChild>
	<div class="flex items-center gap-3">
		<Checkbox disabled aria-label="Disabled" />
		<Checkbox disabled checked aria-label="Disabled and checked" />
		<Checkbox disabled indeterminate aria-label="Disabled and indeterminate" />
	</div>
</Story>

<Story name="With a label" asChild>
	<div class="flex items-center gap-2">
		<Checkbox id="checkbox-terms" />
		<Label for="checkbox-terms">Accept terms and conditions</Label>
	</div>
</Story>

<Story name="Group" asChild>
	<fieldset class="flex flex-col gap-3">
		<legend class="mb-2 text-sm font-medium text-foreground-soft">Notifications</legend>
		<div class="flex items-center gap-2">
			<Checkbox id="notify-all" indeterminate />
			<Label for="notify-all">Everything</Label>
		</div>
		<div class="ml-6 flex items-center gap-2">
			<Checkbox id="notify-mentions" checked />
			<Label for="notify-mentions">Mentions</Label>
		</div>
		<div class="ml-6 flex items-center gap-2">
			<Checkbox id="notify-replies" />
			<Label for="notify-replies">Replies</Label>
		</div>
	</fieldset>
</Story>
