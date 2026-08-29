<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { SidebarGroupProps } from './SidebarGroup.types.js';

	let { class: className, children, ...restProps }: SidebarGroupProps = $props();
</script>

<div data-slot="sidebar-group" class={cn('flex flex-col gap-tight', className)} {...restProps}>
	{@render children()}
</div>
