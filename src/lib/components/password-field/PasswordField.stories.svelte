<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import PasswordField from './PasswordField.svelte';
	import type { PasswordFieldProps } from './PasswordField.types.js';

	type PasswordFieldStoryArgs = Pick<
		PasswordFieldProps,
		'variant' | 'size' | 'placeholder' | 'disabled' | 'invalid' | 'visible'
	>;

	const { Story } = defineMeta({
		title: 'Components/PasswordField',
		component: PasswordField,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['default', 'ghost'] },
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			disabled: { control: 'boolean' },
			invalid: { control: 'boolean' },
			visible: { control: 'boolean' }
		}
	});
</script>

{#snippet lockIcon()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<rect x="4" y="10" width="16" height="10" rx="2" />
		<path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-linecap="round" />
	</svg>
{/snippet}

<Story name="Default" args={{ placeholder: 'Password' }}>
	{#snippet template(args: PasswordFieldStoryArgs)}
		<PasswordField {...args} />
	{/snippet}
</Story>

<Story name="Revealed" args={{ placeholder: 'Password', visible: true }}>
	{#snippet template(args: PasswordFieldStoryArgs)}
		<PasswordField {...args} value="hunter2" />
	{/snippet}
</Story>

<Story name="With prefix icon" args={{ placeholder: 'Password' }}>
	{#snippet template(args: PasswordFieldStoryArgs)}
		<PasswordField {...args}>
			{#snippet prefix()}{@render lockIcon()}{/snippet}
		</PasswordField>
	{/snippet}
</Story>

<Story name="Invalid" args={{ placeholder: 'Password', invalid: true }}>
	{#snippet template(args: PasswordFieldStoryArgs)}
		<PasswordField {...args} value="short" />
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-72 flex-col gap-3">
		<PasswordField size="sm" placeholder="Small" />
		<PasswordField size="md" placeholder="Medium" />
		<PasswordField size="lg" placeholder="Large" />
	</div>
</Story>

<Story name="Disabled" args={{ placeholder: 'Password', disabled: true }}>
	{#snippet template(args: PasswordFieldStoryArgs)}
		<PasswordField {...args} value="hunter2" />
	{/snippet}
</Story>
