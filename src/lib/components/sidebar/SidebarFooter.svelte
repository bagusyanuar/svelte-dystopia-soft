<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { SidebarFooterProps } from './SidebarFooter.types.js';

	let { class: className, children, ...restProps }: SidebarFooterProps = $props();
</script>

<div
	data-slot="sidebar-footer"
	class={cn('flex flex-col gap-cozy border-t border-border p-compact', className)}
	{...restProps}
>
	{@render children()}
</div>
