<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { toggleVariants } from './Toggle.variants.js';
	import type { ToggleProps } from './Toggle.types.js';

	let {
		variant,
		size,
		class: className,
		ref = $bindable(null),
		pressed = $bindable(false),
		disabled = false,
		children,
		...restProps
	}: ToggleProps = $props();
</script>

<button
	type="button"
	bind:this={ref}
	{disabled}
	aria-pressed={pressed}
	data-state={pressed ? 'on' : 'off'}
	onclick={() => (pressed = !pressed)}
	class={cn(toggleVariants({ variant, size }), className)}
	{...restProps}
>
	{@render children()}
</button>
