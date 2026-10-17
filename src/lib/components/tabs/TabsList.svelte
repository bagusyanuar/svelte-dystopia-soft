<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { createRovingFocus } from '../../utils/roving-focus.js';
	import { getTabsContext } from './tabs-context.js';
	import { tabsListVariants } from './Tabs.variants.js';
	import type { TabsListProps } from './TabsList.types.js';

	let {
		class: className,
		variant: propVariant,
		ref = $bindable(null),
		children,
		...restProps
	}: TabsListProps = $props();

	const context = getTabsContext();
	const orientation = $derived(context.getOrientation());
	const variant = $derived(propVariant ?? context.getVariant());

	// Tabs use "automatic activation": moving focus with arrow keys also
	// selects the tab, unlike a menu's roving focus where focus and selection
	// are separate steps.
	const roving = createRovingFocus({
		getContainer: () => ref,
		selector: '[role="tab"]:not(:disabled)'
	});

	function activateFocused() {
		const value = (document.activeElement as HTMLElement | null)?.dataset.value;
		if (value) context.setValue(value);
	}

	function handleKeydown(event: KeyboardEvent) {
		const isVertical = orientation === 'vertical';
		const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
		const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

		if (event.key === nextKey || (!isVertical && event.key === 'ArrowDown') || (isVertical && event.key === 'ArrowRight')) {
			event.preventDefault();
			roving.focusAdjacent(1);
			activateFocused();
		} else if (event.key === prevKey || (!isVertical && event.key === 'ArrowUp') || (isVertical && event.key === 'ArrowLeft')) {
			event.preventDefault();
			roving.focusAdjacent(-1);
			activateFocused();
		} else if (event.key === 'Home') {
			event.preventDefault();
			roving.focusFirst();
			activateFocused();
		} else if (event.key === 'End') {
			event.preventDefault();
			roving.focusLast();
			activateFocused();
		}
	}
</script>

<div
	bind:this={ref}
	role="tablist"
	aria-orientation={orientation}
	data-slot="tabs-list"
	data-orientation={orientation}
	data-variant={variant}
	onkeydown={handleKeydown}
	class={cn(tabsListVariants({ variant, orientation }), className)}
	{...restProps}
>
	{@render children()}
</div>


