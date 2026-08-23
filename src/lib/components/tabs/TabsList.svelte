<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { createRovingFocus } from '../../utils/roving-focus.js';
	import { getTabsContext } from './tabs-context.js';
	import type { TabsListProps } from './TabsList.types.js';

	let { class: className, children, ...restProps }: TabsListProps = $props();

	const context = getTabsContext();

	let listEl = $state<HTMLDivElement | null>(null);

	// Tabs use "automatic activation": moving focus with arrow keys also
	// selects the tab, unlike a menu's roving focus where focus and selection
	// are separate steps.
	const roving = createRovingFocus({
		getContainer: () => listEl,
		selector: '[role="tab"]:not(:disabled)'
	});

	function activateFocused() {
		const value = (document.activeElement as HTMLElement | null)?.dataset.value;
		if (value) context.setValue(value);
	}

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowRight':
				event.preventDefault();
				roving.focusAdjacent(1);
				activateFocused();
				break;
			case 'ArrowLeft':
				event.preventDefault();
				roving.focusAdjacent(-1);
				activateFocused();
				break;
			case 'Home':
				event.preventDefault();
				roving.focusFirst();
				activateFocused();
				break;
			case 'End':
				event.preventDefault();
				roving.focusLast();
				activateFocused();
				break;
		}
	}
</script>

<div
	bind:this={listEl}
	role="tablist"
	aria-orientation="horizontal"
	onkeydown={handleKeydown}
	class={cn('inline-flex items-center gap-1 rounded-md bg-surface-subtle p-1', className)}
	{...restProps}
>
	{@render children()}
</div>
