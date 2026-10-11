<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { idFor } from '../../utils/id.js';
	import { getAccordionContext } from './accordion-context.js';
	import type { AccordionItemProps } from './AccordionItem.types.js';

	let {
		value,
		class: className,
		classes,
		ref = $bindable(null),
		triggerRef = $bindable(null),
		disabled = false,
		trigger,
		indicator,
		children,
		...restProps
	}: AccordionItemProps = $props();

	const context = getAccordionContext();
	const open = $derived(context.isOpen(value));
	const triggerId = $derived(idFor(context.baseId, 'trigger', value));
	const contentId = $derived(idFor(context.baseId, 'content', value));
</script>

<div
	bind:this={ref}
	data-state={open ? 'open' : 'closed'}
	data-disabled={disabled ? '' : undefined}
	class={cn('border-b border-border last:border-b-0', className)}
	{...restProps}
>
	<button
		bind:this={triggerRef}
		type="button"
		id={triggerId}
		{disabled}
		aria-expanded={open}
		aria-controls={contentId}
		data-state={open ? 'open' : 'closed'}
		onclick={() => context.toggle(value)}
		class={cn(
			'flex w-full items-center justify-between gap-tight px-control-x py-compact text-left text-sm leading-snug font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			classes?.trigger
		)}
	>
		{@render trigger({ open })}
		{#if indicator}
			{@render indicator({ open })}
		{:else}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class={cn(
					'size-4 shrink-0 text-foreground-faint transition-transform duration-150',
					open && 'rotate-180',
					classes?.indicator
				)}
			>
				<path d="m6 9 6 6 6-6" />
			</svg>
		{/if}
	</button>

	<div
		id={contentId}
		data-state={open ? 'open' : 'closed'}
		inert={!open}
		class={cn(
			'grid transition-[grid-template-rows] duration-200 ease-out',
			open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
			classes?.panel
		)}
	>
		<div class="overflow-hidden">
			<div class={cn('px-control-x pb-compact text-sm text-foreground-muted', classes?.content)}>
				{@render children({ open })}
			</div>
		</div>
	</div>
</div>
