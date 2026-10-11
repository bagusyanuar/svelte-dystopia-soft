<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Popover from '../popover/Popover.svelte';
	import type { BreadcrumbEllipsisProps } from './BreadcrumbEllipsis.types.js';

	let {
		classes,
		open = $bindable(false),
		placement = 'bottom-start',
		labels,
		trigger: triggerSnippet,
		children,
		...restProps
	}: BreadcrumbEllipsisProps = $props();
</script>

<Popover
	bind:open
	{placement}
	{...restProps}
	classes={{
		trigger: cn(
			'h-auto w-auto border-0 px-1 py-1 text-foreground-faint hover:bg-surface-subtle hover:text-foreground-soft',
			classes?.trigger
		),
		content: cn('min-w-36 p-1', classes?.content)
	}}
>
	{#snippet trigger()}
		{#if triggerSnippet}
			{@render triggerSnippet({ open })}
		{:else}
			<span class="sr-only">{labels?.more ?? 'More'}</span>
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-4">
				<circle cx="5" cy="12" r="1.5" />
				<circle cx="12" cy="12" r="1.5" />
				<circle cx="19" cy="12" r="1.5" />
			</svg>
		{/if}
	{/snippet}
	{@render children()}
</Popover>
