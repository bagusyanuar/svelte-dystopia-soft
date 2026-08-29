<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { SidebarHeaderProps } from './SidebarHeader.types.js';

	let { class: className, children, ...restProps }: SidebarHeaderProps = $props();
</script>

<div
	data-slot="sidebar-header"
	class={cn('flex items-center gap-cozy border-b border-border p-compact', className)}
	{...restProps}
>
	{@render children()}
</div>
