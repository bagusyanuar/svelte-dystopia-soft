<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { DropdownItemProps } from './DropdownItem.types.js';

	let {
		class: className,
		disabled = false,
		onSelect,
		children,
		...restProps
	}: DropdownItemProps = $props();

	const itemProps = $derived({
		...restProps,
		type: 'button' as const,
		role: 'menuitem' as const,
		tabindex: -1,
		disabled,
		class: cn(
			'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:bg-surface-subtle focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			className
		),
		onclick: () => {
			if (!disabled) onSelect?.();
		}
	});
</script>

<button {...itemProps}>
	{@render children()}
</button>
