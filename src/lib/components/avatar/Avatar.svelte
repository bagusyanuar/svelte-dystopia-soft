<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { AvatarProps, AvatarStatus } from './Avatar.types.js';

	let {
		src,
		alt,
		classes,
		class: className,
		ref = $bindable(null),
		imageRef = $bindable(null),
		imageProps,
		children,
		...restProps
	}: AvatarProps = $props();

	let status = $state<AvatarStatus>('loading');

	$effect(() => {
		// Re-arm on every `src` change so a new image gets its own load/error
		// cycle instead of inheriting the previous image's status.
		void src;
		status = 'loading';
	});
</script>

<span
	bind:this={ref}
	data-status={status}
	class={cn(
		'relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-subtle text-sm',
		className
	)}
	{...restProps}
>
	{#if src && status !== 'error'}
		<img
			bind:this={imageRef}
			{src}
			{alt}
			onload={() => (status = 'loaded')}
			onerror={() => (status = 'error')}
			{...imageProps}
			class={cn(
				'size-full object-cover',
				status !== 'loaded' && 'hidden',
				classes?.image,
				imageProps?.class
			)}
		/>
	{/if}
	{#if status !== 'loaded'}
		<span class={cn('font-medium text-foreground-subtle', classes?.fallback)}>
			{@render children?.({ status })}
		</span>
	{/if}
</span>
