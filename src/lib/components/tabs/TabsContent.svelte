<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { idFor } from '../../utils/id.js';
	import { getTabsContext } from './tabs-context.js';
	import type { TabsContentProps } from './TabsContent.types.js';

	let { value, class: className, children, ...restProps }: TabsContentProps = $props();

	const context = getTabsContext();
	const selected = $derived(context.getValue() === value);
</script>

{#if selected}
	<div
		id={idFor(context.baseId, 'panel', value)}
		role="tabpanel"
		aria-labelledby={idFor(context.baseId, 'tab', value)}
		tabindex="0"
		class={cn('text-sm text-foreground-muted focus-visible:outline-none', className)}
		{...restProps}
	>
		{@render children()}
	</div>
{/if}
