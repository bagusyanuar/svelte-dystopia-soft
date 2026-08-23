<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { idFor } from '../../utils/id.js';
	import { getTabsContext } from './tabs-context.js';
	import type { TabsTriggerProps } from './TabsTrigger.types.js';

	let {
		value,
		class: className,
		disabled = false,
		children,
		...restProps
	}: TabsTriggerProps = $props();

	const context = getTabsContext();
	const selected = $derived(context.getValue() === value);
</script>

<button
	type="button"
	role="tab"
	id={idFor(context.baseId, 'tab', value)}
	aria-selected={selected}
	aria-controls={idFor(context.baseId, 'panel', value)}
	data-state={selected ? 'active' : 'inactive'}
	data-value={value}
	tabindex={selected ? 0 : -1}
	{disabled}
	onclick={() => context.setValue(value)}
	class={cn(
		'cursor-pointer rounded-md px-compact py-control-y text-sm leading-snug font-medium text-foreground-subtle transition-colors duration-150 hover:bg-surface-hover hover:text-foreground-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=active]:bg-surface data-[state=active]:text-foreground',
		className
	)}
	{...restProps}
>
	{@render children()}
</button>
