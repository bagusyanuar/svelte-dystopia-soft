<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CollapsibleProps } from './Collapsible.types.js';

	let {
		class: className,
		classes,
		open = $bindable(false),
		disabled = false,
		trigger,
		children,
		...restProps
	}: CollapsibleProps = $props();

	const contentId = $props.id();
</script>

<div class={cn('rounded-lg border border-border', className)} {...restProps}>
	<button
		type="button"
		{disabled}
		aria-expanded={open}
		aria-controls={contentId}
		data-state={open ? 'open' : 'closed'}
		onclick={() => (open = !open)}
		class={cn(
			'flex w-full items-center justify-between gap-tight rounded-lg px-control-x py-compact text-left text-sm leading-snug font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			classes?.trigger
		)}
	>
		{@render trigger()}
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
				open && 'rotate-180'
			)}
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</button>

	<div
		id={contentId}
		data-state={open ? 'open' : 'closed'}
		inert={!open}
		class={cn(
			'grid transition-[grid-template-rows] duration-200 ease-out',
			open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
		)}
	>
		<div class="overflow-hidden">
			<div class={cn('px-control-x pb-compact text-sm text-foreground-muted', classes?.content)}>
				{@render children()}
			</div>
		</div>
	</div>
</div>
