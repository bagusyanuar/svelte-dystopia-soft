<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { SidebarContentProps } from './SidebarContent.types.js';

	let { class: className, children, ...restProps }: SidebarContentProps = $props();
</script>

<div
	data-slot="sidebar-content"
	class={cn('flex min-h-0 flex-1 flex-col gap-loose overflow-y-auto p-compact', className)}
	{...restProps}
>
	{@render children()}
</div>
