<script lang="ts">
	import Avatar from './Avatar.svelte';
	import type { AvatarProps } from './Avatar.types.js';

	let {
		src = '/jane.png',
		alt = 'Jane Doe',
		classes,
		imageProps
	}: {
		src?: string;
		alt?: string;
		classes?: AvatarProps['classes'];
		imageProps?: AvatarProps['imageProps'];
	} = $props();

	let avatarRef = $state<HTMLSpanElement | null>(null);
	let imgRef = $state<HTMLImageElement | null>(null);
</script>

<Avatar bind:ref={avatarRef} bind:imageRef={imgRef} {src} {alt} {classes} {imageProps}>
	{#snippet children({ status })}
		<span data-testid="status-in-fallback">{status}</span>
	{/snippet}
</Avatar>

<span data-testid="has-avatar-ref">{avatarRef ? 'yes' : 'no'}</span>
<span data-testid="has-img-ref">{imgRef ? 'yes' : 'no'}</span>
