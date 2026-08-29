<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { getSidebarContext } from './sidebar-context.js';
	import { sidebarItemVariants } from './SidebarItem.variants.js';
	import type { SidebarItemProps } from './SidebarItem.types.js';

	let {
		active = false,
		size = 'default',
		class: className,
		icon,
		children,
		child,
		...restProps
	}: SidebarItemProps = $props();

	const context = getSidebarContext();

	const mergedProps = $derived({
		type: 'button' as const,
		'data-state': active ? ('active' as const) : ('inactive' as const),
		'aria-current': active ? ('page' as const) : undefined,
		class: cn(sidebarItemVariants({ active, size }), className),
		...restProps
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{#if active}
			<span aria-hidden="true" class="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary"
			></span>
		{/if}
		{#if icon}
			<span
				class={cn('shrink-0', active ? 'text-primary' : 'text-foreground-faint')}
				aria-hidden="true"
			>
				{@render icon()}
			</span>
		{/if}
		<span
			data-state={context.isCollapsed() ? 'collapsed' : 'expanded'}
			class="truncate data-[state=collapsed]:sr-only"
		>
			{@render children()}
		</span>
	</button>
{/if}
