<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { idFor } from '../../utils/id.js';
	import { getTabsContext } from './tabs-context.js';
	import { tabsTriggerVariants } from './Tabs.variants.js';
	import type { TabsTriggerProps } from './TabsTrigger.types.js';

	let {
		value,
		class: className,
		variant: propVariant,
		disabled = false,
		ref = $bindable(null),
		child,
		children,
		onclick,
		...restProps
	}: TabsTriggerProps = $props();

	const context = getTabsContext();
	const selected = $derived(context.getValue() === value);
	const orientation = $derived(context.getOrientation());
	const variant = $derived(propVariant ?? context.getVariant());

	function handleClick(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
		onclick?.(event);
		if (!event.defaultPrevented && !disabled) {
			context.setValue(value);
		}
	}

	const triggerProps = $derived({
		type: 'button' as const,
		role: 'tab' as const,
		id: idFor(context.baseId, 'tab', value),
		'aria-selected': selected,
		'aria-controls': idFor(context.baseId, 'panel', value),
		'data-slot': 'tabs-trigger',
		'data-state': selected ? 'active' : 'inactive',
		'data-selected': selected ? '' : undefined,
		'data-disabled': disabled ? '' : undefined,
		'data-orientation': orientation,
		'data-variant': variant,
		'data-value': value,
		tabindex: selected ? 0 : -1,
		disabled,
		onclick: handleClick,
		class: cn(tabsTriggerVariants({ variant, orientation }), className),
		...restProps
	});
</script>

{#if child}
	{@render child({
		props: triggerProps,
		active: selected,
		disabled: Boolean(disabled)
	})}
{:else}
	<button bind:this={ref} {...triggerProps}>
		{@render children?.({ active: selected, disabled: Boolean(disabled) })}
	</button>
{/if}



