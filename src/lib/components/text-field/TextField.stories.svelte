<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TextField from './TextField.svelte';
	import type { TextFieldProps } from './TextField.types.js';

	type TextFieldStoryArgs = Pick<
		TextFieldProps,
		'variant' | 'size' | 'placeholder' | 'disabled' | 'invalid'
	>;

	const { Story } = defineMeta({
		title: 'Components/TextField',
		component: TextField,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['default', 'ghost'] },
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			disabled: { control: 'boolean' },
			invalid: { control: 'boolean' }
		}
	});
</script>

{#snippet searchIcon()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<circle cx="11" cy="11" r="7" />
		<path d="m20 20-3.5-3.5" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet mailIcon()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<rect x="3" y="5" width="18" height="14" rx="2" />
		<path d="m3 7 9 6 9-6" stroke-linecap="round" />
	</svg>
{/snippet}

<Story name="Default" args={{ placeholder: 'Type something…' }}>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args} />
	{/snippet}
</Story>

<Story name="Prefix icon" args={{ placeholder: 'Search…' }}>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args}>
			{#snippet prefix()}{@render searchIcon()}{/snippet}
		</TextField>
	{/snippet}
</Story>

<Story name="Suffix icon" args={{ placeholder: 'you@company.com' }}>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args}>
			{#snippet suffix()}{@render mailIcon()}{/snippet}
		</TextField>
	{/snippet}
</Story>

<Story name="Prefix and suffix" args={{ placeholder: 'Search…' }}>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args}>
			{#snippet prefix()}{@render searchIcon()}{/snippet}
			{#snippet suffix()}<kbd class="text-xs text-foreground-muted">⌘K</kbd>{/snippet}
		</TextField>
	{/snippet}
</Story>

<Story name="Ghost" args={{ variant: 'ghost', placeholder: 'Search…' }}>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args}>
			{#snippet prefix()}{@render searchIcon()}{/snippet}
		</TextField>
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-72 flex-col gap-3">
		<TextField size="sm" placeholder="Small" />
		<TextField size="md" placeholder="Medium" />
		<TextField size="lg" placeholder="Large" />
	</div>
</Story>

<Story name="Invalid" args={{ invalid: true, placeholder: 'you@company.com' }}>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args} />
	{/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true, placeholder: 'Disabled' }}>
	{#snippet template(args: TextFieldStoryArgs)}
		<TextField {...args} />
	{/snippet}
</Story>
