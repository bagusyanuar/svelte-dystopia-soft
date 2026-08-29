<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { getSidebarContext } from './sidebar-context.js';
	import type { SidebarTriggerProps } from './SidebarTrigger.types.js';

	let { class: className, labels, ...restProps }: SidebarTriggerProps = $props();

	const context = getSidebarContext();
	const collapsed = $derived(context.isCollapsed());
</script>

<button
	type="button"
	aria-label={collapsed
		? (labels?.expand ?? 'Expand sidebar')
		: (labels?.collapse ?? 'Collapse sidebar')}
	aria-expanded={!collapsed}
	data-state={collapsed ? 'collapsed' : 'expanded'}
	onclick={() => context.toggleCollapsed()}
	class={cn(
		'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground-subtle transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
		className
	)}
	{...restProps}
>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={cn('size-4 transition-transform duration-150', collapsed && 'rotate-180')}
	>
		<path d="m11 17-5-5 5-5" />
		<path d="m18 17-5-5 5-5" />
	</svg>
</button>
