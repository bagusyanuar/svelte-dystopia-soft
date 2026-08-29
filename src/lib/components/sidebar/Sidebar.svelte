<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { setSidebarContext } from './sidebar-context.js';
	import { sidebarVariants } from './Sidebar.variants.js';
	import type { SidebarProps } from './Sidebar.types.js';

	let {
		collapsed = $bindable(false),
		class: className,
		children,
		...restProps
	}: SidebarProps = $props();

	setSidebarContext({
		isCollapsed: () => collapsed,
		toggleCollapsed: () => (collapsed = !collapsed),
		setCollapsed: (value) => (collapsed = value)
	});
</script>

<aside
	data-slot="sidebar"
	data-state={collapsed ? 'collapsed' : 'expanded'}
	class={cn(sidebarVariants({ collapsed }), className)}
	{...restProps}
>
	{@render children()}
</aside>
