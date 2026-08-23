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
		value = $bindable(''),
		disabled = false,
		invalid = false,
		children,
		...restProps
	}: SelectProps = $props();
</script>

<div
	class={cn('group relative inline-block w-full', className)}
	data-disabled={disabled ? '' : undefined}
>
	<select
		bind:this={ref}
		bind:value
		{disabled}
		aria-invalid={invalid || undefined}
		data-invalid={invalid ? '' : undefined}
		class={cn(selectVariants({ variant, size }), classes?.select)}
		{...restProps}
	>
		{@render children()}
	</select>

	<span
		class={cn(
			'pointer-events-none absolute inset-y-0 right-3 flex items-center text-foreground-faint group-data-disabled:opacity-50 [&_svg]:size-4',
			classes?.icon
		)}
	>
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
	</span>
</div>
