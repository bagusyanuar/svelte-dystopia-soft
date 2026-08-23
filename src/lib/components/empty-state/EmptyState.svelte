<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { EmptyStateProps } from './EmptyState.types.js';

	let {
		class: className,
		classes,
		icon,
		title,
		description,
		children,
		...restProps
	}: EmptyStateProps = $props();
</script>

<div
	role="status"
	class={cn('flex flex-col items-center gap-cozy px-surface py-12 text-center', className)}
	{...restProps}
>
	{#if icon}
		<span aria-hidden="true" class={cn('text-foreground-faint [&_svg]:size-10', classes?.icon)}>
			{@render icon()}
		</span>
	{/if}
	{#if title}
		<p class={cn('leading-snug font-medium text-foreground', classes?.title)}>
			{@render title()}
		</p>
	{/if}
	{#if description}
		<p class={cn('max-w-sm text-sm leading-snug text-foreground-subtle', classes?.description)}>
			{@render description()}
		</p>
	{/if}
	{@render children?.()}
</div>
