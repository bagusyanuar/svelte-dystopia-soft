<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { selectVariants } from './Select.variants.js';
	import type { SelectProps } from './Select.types.js';

	let {
		variant,
		size,
		class: className,
		classes,
		ref = $bindable(null),
		selectRef = $bindable(null),
		containerRef = $bindable(null),
		value = $bindable(''),
		disabled = false,
		invalid = false,
		icon,
		onValueChange,
		onchange,
		children,
		...restProps
	}: SelectProps = $props();

	$effect(() => {
		selectRef = ref ?? selectRef;
	});

	function handleChange(event: Event & { currentTarget: HTMLSelectElement }): void {
		onchange?.(event);
		onValueChange?.(event.currentTarget.value);
	}
</script>

<div
	bind:this={containerRef}
	class={cn('group relative inline-block w-full', className, classes?.container)}
	data-slot="select"
	data-disabled={disabled ? '' : undefined}
	data-invalid={invalid ? '' : undefined}
	data-has-value={value ? '' : undefined}
>
	<select
		bind:this={ref}
		bind:value
		{disabled}
		aria-invalid={invalid || undefined}
		data-slot="select-input"
		data-disabled={disabled ? '' : undefined}
		data-invalid={invalid ? '' : undefined}
		data-has-value={value ? '' : undefined}
		class={cn(selectVariants({ variant, size }), classes?.select)}
		onchange={handleChange}
		{...restProps}
	>
		{@render children?.({ disabled: !!disabled, invalid: !!invalid, value: value ?? '' })}
	</select>

	<span
		data-slot="select-icon"
		class={cn(
			'pointer-events-none absolute inset-y-0 right-3 flex items-center text-foreground-faint group-data-disabled:opacity-50 [&_svg]:size-4',
			classes?.icon
		)}
	>
		{#if icon}
			{@render icon({ disabled: !!disabled, invalid: !!invalid, value: value ?? '' })}
		{:else}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="m7 15 5 5 5-5" />
				<path d="m7 9 5-5 5 5" />
			</svg>
		{/if}
	</span>
</div>
