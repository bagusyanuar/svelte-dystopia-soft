<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { setAccordionContext } from './accordion-context.js';
	import type { AccordionProps } from './Accordion.types.js';

	let {
		type = 'single',
		value = $bindable(),
		class: className,
		children,
		...restProps
	}: AccordionProps = $props();

	const baseId = $props.id();

	function isOpen(itemValue: string): boolean {
		if (type === 'multiple') {
			return ((value as string[] | undefined) ?? []).includes(itemValue);
		}
		return value === itemValue;
	}

	function toggle(itemValue: string) {
		if (type === 'multiple') {
			const current = (value as string[] | undefined) ?? [];
			value = current.includes(itemValue)
				? current.filter((v) => v !== itemValue)
				: [...current, itemValue];
		} else {
			value = value === itemValue ? '' : itemValue;
		}
	}

	setAccordionContext({ baseId, isOpen, toggle });
</script>

<div class={cn('overflow-hidden rounded-lg border border-border', className)} {...restProps}>
	{@render children()}
</div>
