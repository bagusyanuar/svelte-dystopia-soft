<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { LabelProps } from './Label.types.js';

	let {
		required = false,
		disabled = false,
		class: className,
		classes,
		ref = $bindable(null),
		requiredIndicator,
		children,
		...restProps
	}: LabelProps = $props();
</script>

<label
	bind:this={ref}
	data-slot="label"
	data-disabled={disabled ? '' : undefined}
	data-required={required ? '' : undefined}
	class={cn(
		'inline-flex items-center gap-tight text-sm leading-snug font-medium text-foreground-soft select-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
		className
	)}
	{...restProps}
>
	{@render children({ required, disabled })}
	{#if required}
		{#if requiredIndicator}
			<span data-slot="label-required" aria-hidden="true" class={classes?.required}>
				{@render requiredIndicator({ required })}
			</span>
		{:else}
			<span
				data-slot="label-required"
				aria-hidden="true"
				class={cn('text-danger', classes?.required)}
			>
				*
			</span>
		{/if}
	{/if}
</label>
