<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { getSidebarContext } from './sidebar-context.js';
	import type { SidebarGroupLabelProps } from './SidebarGroupLabel.types.js';

	let { class: className, children, ...restProps }: SidebarGroupLabelProps = $props();

	const context = getSidebarContext();
</script>

<div
	data-slot="sidebar-group-label"
	data-state={context.isCollapsed() ? 'collapsed' : 'expanded'}
	class={cn(
		'px-compact text-xs leading-snug font-medium tracking-wide text-foreground-subtle uppercase data-[state=collapsed]:sr-only',
		className
	)}
	{...restProps}
>
	{@render children()}
</div>
