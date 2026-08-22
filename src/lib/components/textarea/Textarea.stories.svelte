<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Textarea from './Textarea.svelte';
	import type { TextareaProps } from './Textarea.types.js';

	type TextareaStoryArgs = Pick<
		TextareaProps,
		'variant' | 'size' | 'placeholder' | 'disabled' | 'invalid' | 'maxlength' | 'autoResize'
	>;

	const { Story } = defineMeta({
		title: 'Components/Textarea',
		component: Textarea,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['default', 'ghost'] },
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			disabled: { control: 'boolean' },
			invalid: { control: 'boolean' },
			maxlength: { control: 'number' },
			autoResize: { control: 'boolean' }
		}
	});
</script>

<Story name="Default" args={{ placeholder: 'Tell us about yourself…' }}>
	{#snippet template(args: TextareaStoryArgs)}
		<Textarea {...args} />
	{/snippet}
</Story>

<Story name="Ghost" args={{ variant: 'ghost', placeholder: 'Tell us about yourself…' }}>
	{#snippet template(args: TextareaStoryArgs)}
		<Textarea {...args} />
	{/snippet}
</Story>

<Story name="Sizes" asChild>
	<div class="flex w-72 flex-col gap-3">
		<Textarea size="sm" placeholder="Small" />
		<Textarea size="md" placeholder="Medium" />
		<Textarea size="lg" placeholder="Large" />
	</div>
</Story>

<Story name="Invalid" args={{ invalid: true, placeholder: 'Tell us about yourself…' }}>
	{#snippet template(args: TextareaStoryArgs)}
		<Textarea {...args} />
	{/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true, placeholder: 'Disabled' }}>
	{#snippet template(args: TextareaStoryArgs)}
		<Textarea {...args} />
	{/snippet}
</Story>

<Story name="Character limit" args={{ placeholder: 'Write a short bio…', maxlength: 100 }}>
	{#snippet template(args: TextareaStoryArgs)}
		<div class="w-72">
			<Textarea {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Character limit reached" asChild>
	<div class="w-72">
		<Textarea maxlength={20} value="This bio is at the l" aria-label="Bio at limit" />
	</div>
</Story>

<Story
	name="Auto resize"
	args={{ autoResize: true, placeholder: 'Grows as you type instead of scrolling…' }}
>
	{#snippet template(args: TextareaStoryArgs)}
		<div class="w-72">
			<Textarea {...args} />
		</div>
	{/snippet}
</Story>
