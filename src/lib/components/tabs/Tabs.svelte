<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { setTabsContext } from './tabs-context.js';
	import type { TabsProps } from './Tabs.types.js';

	let {
		value = $bindable(''),
		defaultValue = '',
		variant = 'pill',
		orientation = 'horizontal',
		onValueChange,
		class: className,
		classes,
		ref = $bindable(null),
		children,
		...restProps
	}: TabsProps = $props();

	const baseId = $props.id();

	setTabsContext({
		baseId,
		getOrientation: () => orientation,
		getVariant: () => variant,
		getValue: () => value || defaultValue,
		setValue: (next) => {
			value = next;
			onValueChange?.(next);
		}
	});
</script>

<div
	bind:this={ref}
	data-slot="tabs"
	data-orientation={orientation}
	data-variant={variant}
	data-value={value || defaultValue}
	class={cn(
		'flex gap-cozy',
		orientation === 'vertical' ? 'flex-row' : 'flex-col',
		classes?.root,
		className
	)}
	{...restProps}
>
	{@render children()}
</div>



