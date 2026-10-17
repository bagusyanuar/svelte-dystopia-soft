<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Switch from './Switch.svelte';
	import Label from '../label/Label.svelte';
	import SwitchInteractiveDemo from './SwitchInteractiveDemo.svelte';
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

<Story name="Interactive Demo" asChild>
	<div class="flex flex-col gap-4">
		<SwitchInteractiveDemo />
		<SwitchInteractiveDemo
			label="Dark Mode Toggle"
			description="Switches the interface palette between dark and light themes."
			checked={true}
			withIcon={true}
		/>
	</div>
</Story>

<Story name="Sizes" asChild>
	<div class="flex items-center gap-4">
		<Switch size="sm" checked aria-label="Small" />
		<Switch size="md" checked aria-label="Medium" />
		<Switch size="lg" checked aria-label="Large" />
	</div>
</Story>

<Story name="With Integrated Label & Description" asChild>
	<div class="flex flex-col gap-5">
		<Switch
			label="Push Notifications"
			description="Receive push alerts on desktop and mobile devices."
			checked
		/>
		<Switch
			label="Two-Factor Authentication"
			description="Require a secondary 6-digit verification code when logging in."
		/>
		<Switch
			label="Diagnostics & Usage Analytics"
			description="Help improve the product by sending anonymized crash reports."
			disabled
		/>
	</div>
</Story>

<Story name="Custom Thumb Icon" asChild>
	<div class="flex items-center gap-6">
		<Switch size="lg" checked aria-label="Theme switch">
			{#snippet thumb({ checked })}
				{#if checked}
					<svg
						class="size-3 text-primary"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
					</svg>
				{:else}
					<svg
						class="size-3 text-foreground-faint"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2" />
						<path d="M12 20v2" />
						<path d="m4.93 4.93 1.41 1.41" />
						<path d="m17.66 17.66 1.41 1.41" />
						<path d="M2 12h2" />
						<path d="M20 12h2" />
					</svg>
				{/if}
			{/snippet}
		</Switch>

		<Switch size="md" aria-label="Check switch">
			{#snippet thumb({ checked })}
				{#if checked}
					<svg
						class="size-2.5 text-primary"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M20 6 9 17l-5-5" />
					</svg>
				{:else}
					<svg
						class="size-2.5 text-foreground-faint"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 6 6 18M6 6l12 12" />
					</svg>
				{/if}
			{/snippet}
		</Switch>
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

<Story name="External Label (Manual Composition)" asChild>
	<div class="flex items-center gap-2">
		<Switch id="switch-manual-label" />
		<Label for="switch-manual-label">Enable manual notifications</Label>
	</div>
</Story>

<Story name="Group" asChild>
	<fieldset class="flex flex-col gap-3 rounded-md border border-border p-4">
		<legend class="px-1 text-sm font-medium text-foreground-soft">Preferences</legend>
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

