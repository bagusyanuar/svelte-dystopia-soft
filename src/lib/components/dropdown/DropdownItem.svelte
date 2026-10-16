<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { DropdownItemProps } from './DropdownItem.types.js';

	let {
		class: className,
		ref = $bindable(null),
		href,
		disabled = false,
		onSelect,
		child,
		children,
		...restProps
	}: DropdownItemProps = $props();

	const itemProps = $derived({
		...restProps,
		role: 'menuitem' as const,
		tabindex: -1,
		'data-slot': 'dropdown-item',
		'data-disabled': disabled ? '' : undefined,
		...(href
			? { href, 'aria-disabled': disabled || undefined }
			: { type: 'button' as const, disabled }),
		class: cn(
			'flex w-full items-center gap-tight rounded-md px-compact py-2 text-left text-sm text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:bg-surface-subtle focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			className
		),
		onclick: (event: MouseEvent) => {
			if (disabled) {
				event.preventDefault();
				return;
			}
			onSelect?.();
		}
	});
</script>

{#if child}
	{@render child({ props: itemProps })}
{:else if href}
	<a bind:this={ref as HTMLAnchorElement | null} {...itemProps}>
		{@render children?.()}
	</a>
{:else}
	<button bind:this={ref as HTMLButtonElement | null} {...itemProps}>
		{@render children?.()}
	</button>
{/if}
