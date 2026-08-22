<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';
	import type { ButtonProps } from './Button.types.js';

	type ButtonStoryArgs = Pick<ButtonProps, 'variant' | 'size' | 'disabled' | 'isLoading'>;

	const { Story } = defineMeta({
		title: 'Components/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['default', 'outline', 'ghost'] },
			size: { control: 'select', options: ['sm', 'md', 'lg'] },
			disabled: { control: 'boolean' },
			isLoading: { control: 'boolean' }
		}
	});
</script>

{#snippet plusIcon()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		class="size-4"
		aria-hidden="true"
	>
		<path d="M12 5v14M5 12h14" />
	</svg>
{/snippet}

{#snippet dotsLoading()}
	<span class="flex items-center gap-1" aria-hidden="true">
		<span class="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></span>
		<span class="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></span>
		<span class="size-1.5 animate-bounce rounded-full bg-current"></span>
	</span>
{/snippet}

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

<Story name="Sizes" asChild>
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

<Story name="Loading" args={{ isLoading: true }}>
	{#snippet template(args: ButtonStoryArgs)}
		<Button {...args}>Save changes</Button>
	{/snippet}
</Story>

<Story name="Custom loading indicator" asChild>
	<Button isLoading loading={dotsLoading}>Saving</Button>
</Story>

<Story name="Icon only" asChild>
	<div class="flex items-center gap-3">
		<Button size="sm" class="size-8 px-0" aria-label="Add item">
			{@render plusIcon()}
		</Button>
		<Button size="md" class="size-10 px-0" aria-label="Add item">
			{@render plusIcon()}
		</Button>
		<Button size="lg" class="size-12 px-0" aria-label="Add item">
			{@render plusIcon()}
		</Button>
		<Button variant="outline" size="md" class="size-10 px-0" aria-label="Add item">
			{@render plusIcon()}
		</Button>
		<Button variant="ghost" size="md" class="size-10 px-0" aria-label="Add item">
			{@render plusIcon()}
		</Button>
	</div>
</Story>
