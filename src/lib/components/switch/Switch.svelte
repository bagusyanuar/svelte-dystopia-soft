<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { switchVariants, switchThumbVariants } from './Switch.variants.js';
	import type { SwitchProps } from './Switch.types.js';

	let {
		size,
		class: className,
		classes,
		ref = $bindable(null),
		checked = $bindable(false),
		disabled = false,
		invalid = false,
		...restProps
	}: SwitchProps = $props();
</script>

<span
	class={cn(switchVariants({ size }), className)}
	data-disabled={disabled ? '' : undefined}
	data-invalid={invalid ? '' : undefined}
>
	<input
		type="checkbox"
		role="switch"
		bind:this={ref}
		bind:checked
		{disabled}
		class={cn(
			'peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full border border-border bg-surface-subtle transition-colors duration-150 group-data-invalid:border-danger-border checked:border-primary checked:bg-primary hover:bg-surface-hover checked:hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group-data-invalid:focus-visible:ring-danger disabled:cursor-not-allowed',
			classes?.input
		)}
		{...restProps}
	/>

	<span aria-hidden="true" class={cn(switchThumbVariants({ size }), classes?.thumb)}></span>
</span>
