<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';
	import type { ButtonProps } from './Button.types.js';

	type ButtonStoryArgs = Pick<ButtonProps, 'variant' | 'size' | 'disabled'>;

	const { Story } = defineMeta({
		title: 'Components/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['default', 'outline', 'ghost'] },
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			disabled: { control: 'boolean' }
		}
	});
</script>

<Story name="Default" args={{ variant: 'default', size: 'md' }}>
	{#snippet template(args: ButtonStoryArgs)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story name="Outline" args={{ variant: 'outline' }}>
	{#snippet template(args: ButtonStoryArgs)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story name="Ghost" args={{ variant: 'ghost' }}>
	{#snippet template(args: ButtonStoryArgs)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story name="Sizes">
	<div class="flex items-center gap-3">
		<Button size="sm">Small</Button>
		<Button size="md">Medium</Button>
		<Button size="lg">Large</Button>
	</div>
</Story>

<Story name="Disabled" args={{ disabled: true }}>
	{#snippet template(args: ButtonStoryArgs)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>
