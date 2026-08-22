<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Badge from './Badge.svelte';
	import type { BadgeProps } from './Badge.types.js';

	type BadgeStoryArgs = Pick<BadgeProps, 'variant'>;

	const { Story } = defineMeta({
		title: 'Components/Badge',
		component: Badge,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: ['default', 'secondary', 'outline', 'danger'] }
		}
	});
</script>

<Story name="Default">
	{#snippet template(args: BadgeStoryArgs)}
		<Badge {...args}>Badge</Badge>
	{/snippet}
</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>
	{#snippet template(args: BadgeStoryArgs)}
		<Badge {...args}>Badge</Badge>
	{/snippet}
</Story>

<Story name="Outline" args={{ variant: 'outline' }}>
	{#snippet template(args: BadgeStoryArgs)}
		<Badge {...args}>Badge</Badge>
	{/snippet}
</Story>

<Story name="Danger" args={{ variant: 'danger' }}>
	{#snippet template(args: BadgeStoryArgs)}
		<Badge {...args}>Badge</Badge>
	{/snippet}
</Story>

<Story name="Variants" asChild>
	<div class="flex items-center gap-2">
		<Badge variant="default">Default</Badge>
		<Badge variant="secondary">Secondary</Badge>
		<Badge variant="outline">Outline</Badge>
		<Badge variant="danger">Danger</Badge>
	</div>
</Story>

<Story name="With a status dot" asChild>
	<Badge variant="secondary">
		<span class="size-1.5 rounded-full bg-primary" aria-hidden="true"></span>
		Active
	</Badge>
</Story>
