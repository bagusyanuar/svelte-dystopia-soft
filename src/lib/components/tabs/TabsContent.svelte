<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { idFor } from '../../utils/id.js';
	import { getTabsContext } from './tabs-context.js';
	import type { TabsContentProps } from './TabsContent.types.js';

	let {
		value,
		class: className,
		forceMount = false,
		ref = $bindable(null),
		children,
		...restProps
	}: TabsContentProps = $props();

	const context = getTabsContext();
	const selected = $derived(context.getValue() === value);
	const orientation = $derived(context.getOrientation());
</script>

{#if selected || forceMount}
	<div
		bind:this={ref}
		id={idFor(context.baseId, 'panel', value)}
		role="tabpanel"
		aria-labelledby={idFor(context.baseId, 'tab', value)}
		tabindex="0"
		hidden={!selected}
		data-slot="tabs-content"
		data-state={selected ? 'active' : 'inactive'}
		data-value={value}
		data-orientation={orientation}
		class={cn(
			'text-sm text-foreground-muted focus-visible:outline-none',
			!selected && forceMount && 'hidden',
			className
		)}
		{...restProps}
	>
		{@render children({ active: selected })}
	</div>
{/if}

