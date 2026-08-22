<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Switch from './Switch.svelte';
	import Label from '../label/Label.svelte';
	import type { SwitchProps } from './Switch.types.js';

	type SwitchStoryArgs = Pick<SwitchProps, 'size' | 'checked' | 'disabled' | 'invalid'>;

	const { Story } = defineMeta({
		title: 'Components/Switch',
		component: Switch,
		tags: ['autodocs'],
		args: { 'aria-label': 'Notifications' },
		argTypes: {
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			checked: { control: 'boolean' },
			disabled: { control: 'boolean' },
			invalid: { control: 'boolean' }
		}
	});
</script>

<Story name="Default">
	{#snippet template(args: SwitchStoryArgs)}
		<Switch {...args} />
	{/snippet}
</Story>

<Story name="Checked" args={{ checked: true }}>
	{#snippet template(args: SwitchStoryArgs)}
		<Switch {...args} />
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex items-center gap-3">
		<Switch size="sm" checked aria-label="Small" />
		<Switch size="md" checked aria-label="Medium" />
		<Switch size="lg" checked aria-label="Large" />
	</div>
</Story>

<Story name="Invalid" args={{ invalid: true }}>
	{#snippet template(args: SwitchStoryArgs)}
		<Switch {...args} />
	{/snippet}
</Story>

<Story name="Disabled" asChild>
	<div class="flex items-center gap-3">
		<Switch disabled aria-label="Disabled" />
		<Switch disabled checked aria-label="Disabled and checked" />
	</div>
</Story>

<Story name="With a label" asChild>
	<div class="flex items-center gap-2">
		<Switch id="switch-notifications" />
		<Label for="switch-notifications">Enable notifications</Label>
	</div>
</Story>

<Story name="Group" asChild>
	<fieldset class="flex flex-col gap-3">
		<legend class="mb-2 text-sm font-medium text-foreground-soft">Preferences</legend>
		<div class="flex items-center justify-between gap-4">
			<Label for="pref-email">Email notifications</Label>
			<Switch id="pref-email" checked />
		</div>
		<div class="flex items-center justify-between gap-4">
			<Label for="pref-sms">SMS notifications</Label>
			<Switch id="pref-sms" />
		</div>
	</fieldset>
</Story>
