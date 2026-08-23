<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { radioVariants } from './Radio.variants.js';
	import type { RadioProps } from './Radio.types.js';

	let {
		size,
		class: className,
		classes,
		ref = $bindable(null),
		group = $bindable(),
		value,
		disabled = false,
		invalid = false,
		...restProps
	}: RadioProps = $props();
</script>

<span
	class={cn(radioVariants({ size }), className)}
	data-disabled={disabled ? '' : undefined}
	data-invalid={invalid ? '' : undefined}
>
	<input
		type="radio"
		bind:this={ref}
		bind:group
		{value}
		{disabled}
		class={cn(
			'peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full border border-border bg-surface transition-colors duration-150 group-data-invalid:border-danger-border checked:border-primary hover:border-border-hover checked:hover:border-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group-data-invalid:focus-visible:ring-danger disabled:cursor-not-allowed',
			classes?.input
		)}
		{...restProps}
	/>

	<span
		aria-hidden="true"
		class={cn(
			'pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100',
			classes?.indicator
		)}
	>
		<span class="size-[45%] rounded-full bg-primary"></span>
	</span>
</span>
