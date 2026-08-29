<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { getSidebarContext } from './sidebar-context.js';
	import { sidebarItemVariants } from './SidebarItem.variants.js';
	import type { SidebarCollapsibleItemProps } from './SidebarCollapsibleItem.types.js';

	let {
		open = $bindable(false),
		class: className,
		icon,
		trigger,
		children,
		...restProps
	}: SidebarCollapsibleItemProps = $props();

	const context = getSidebarContext();
	const contentId = $props.id();
</script>

<div data-slot="sidebar-collapsible-item">
	<button
		type="button"
		aria-expanded={open}
		aria-controls={contentId}
		data-state={open ? 'open' : 'closed'}
		onclick={() => (open = !open)}
		class={cn(sidebarItemVariants({ active: false }), 'justify-between', className)}
		{...restProps}
	>
		<span class="flex min-w-0 items-center gap-tight">
			{#if icon}
				<span class="shrink-0 text-foreground-faint" aria-hidden="true">
					{@render icon()}
				</span>
			{/if}
			<span
				data-state={context.isCollapsed() ? 'collapsed' : 'expanded'}
				class="truncate data-[state=collapsed]:sr-only"
			>
				{@render trigger()}
			</span>
		</span>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			data-state={context.isCollapsed() ? 'collapsed' : 'expanded'}
			class={cn(
				'size-4 shrink-0 text-foreground-faint transition-transform duration-150 data-[state=collapsed]:hidden',
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
			open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
			context.isCollapsed() && 'hidden'
		)}
	>
		<div class="overflow-hidden">
			<div class="mt-tight ml-5 flex flex-col gap-tight border-l border-border pl-cozy">
				{@render children()}
			</div>
		</div>
	</div>
</div>
