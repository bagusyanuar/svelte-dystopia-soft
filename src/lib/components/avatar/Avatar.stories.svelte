<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Avatar from './Avatar.svelte';
	import type { AvatarProps } from './Avatar.types.js';

	type AvatarStoryArgs = Pick<AvatarProps, 'src' | 'alt'>;

	const { Story } = defineMeta({
		title: 'Components/Avatar',
		component: Avatar,
		tags: ['autodocs']
	});
</script>

<Story name="Image" args={{ src: 'https://i.pravatar.cc/80?img=12', alt: 'Jane Doe' }}>
	{#snippet template(args: AvatarStoryArgs)}
		<Avatar {...args}>JD</Avatar>
	{/snippet}
</Story>

<Story name="Fallback (no image)" args={{ alt: 'Jane Doe' }}>
	{#snippet template(args: AvatarStoryArgs)}
		<Avatar {...args}>JD</Avatar>
	{/snippet}
</Story>

<Story name="Broken image falls back" args={{ src: '/does-not-exist.png', alt: 'Jane Doe' }}>
	{#snippet template(args: AvatarStoryArgs)}
		<Avatar {...args}>JD</Avatar>
	{/snippet}
</Story>

<Story name="Custom size" asChild>
	<div class="flex items-center gap-cozy">
		<Avatar alt="Jane Doe" class="size-6 text-xs">JD</Avatar>
		<Avatar alt="Jane Doe" class="size-10">JD</Avatar>
		<Avatar alt="Jane Doe" class="size-16 text-lg">JD</Avatar>
	</div>
</Story>
