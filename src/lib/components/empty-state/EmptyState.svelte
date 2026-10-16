<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { EmptyStateProps } from './EmptyState.types.js';

	let {
		class: className,
		classes,
		ref = $bindable(null),
		icon,
		title,
		description,
		children,
		...restProps
	}: EmptyStateProps = $props();
</script>

<div
	bind:this={ref}
	role="status"
	data-slot="empty-state"
	class={cn('flex flex-col items-center gap-cozy px-surface py-12 text-center', className)}
	{...restProps}
>
	{#if icon}
		<span
			data-slot="empty-state-icon"
			aria-hidden="true"
			class={cn('text-foreground-faint [&_svg]:size-10', classes?.icon)}
		>
			{@render icon()}
		</span>
	{/if}
	{#if title}
		<p
			data-slot="empty-state-title"
			class={cn('leading-snug font-medium text-foreground', classes?.title)}
		>
			{@render title()}
		</p>
	{/if}
	{#if description}
		<p
			data-slot="empty-state-description"
			class={cn('max-w-sm text-sm leading-snug text-foreground-subtle', classes?.description)}
		>
			{@render description()}
		</p>
	{/if}
	{#if children}
		<div
			data-slot="empty-state-actions"
			class={cn('mt-2 flex flex-wrap items-center justify-center gap-2', classes?.actions)}
		>
			{@render children()}
		</div>
	{/if}
</div>
