<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { toggleVariants } from './Toggle.variants.js';
	import type { ToggleProps } from './Toggle.types.js';

	let {
		variant = 'default',
		size = 'md',
		class: className,
		ref = $bindable(null),
		defaultPressed = false,
		pressed = $bindable(defaultPressed),
		disabled = false,
		onPressedChange,
		onclick,
		child,
		children,
		...restProps
	}: ToggleProps = $props();

	function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onclick?.(event);
		if (!event.defaultPrevented && !disabled) {
			pressed = !pressed;
			onPressedChange?.(pressed);
		}
	}

	const triggerProps = $derived({
		type: 'button' as const,
		disabled: disabled ? true : undefined,
		'aria-pressed': pressed,
		'data-slot': 'toggle',
		'data-state': pressed ? 'on' : 'off',
		'data-pressed': pressed ? '' : undefined,
		'data-disabled': disabled ? '' : undefined,
		'data-variant': variant ?? 'default',
		'data-size': size ?? 'md',
		onclick: handleClick,
		class: cn(toggleVariants({ variant, size }), className),
		...restProps
	});
</script>

{#if child}
	{@render child({
		props: triggerProps,
		pressed,
		disabled: Boolean(disabled)
	})}
{:else}
	<button bind:this={ref} {...triggerProps}>
		{@render children?.({ pressed, disabled: Boolean(disabled) })}
	</button>
{/if}

