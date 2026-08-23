<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { setTabsContext } from './tabs-context.js';
	import type { TabsProps } from './Tabs.types.js';

	let { value = $bindable(''), class: className, children, ...restProps }: TabsProps = $props();

	const baseId = $props.id();

	setTabsContext({
		baseId,
		getValue: () => value,
		setValue: (next) => (value = next)
	});
</script>

<div class={cn('flex flex-col gap-cozy', className)} {...restProps}>
	{@render children()}
</div>
