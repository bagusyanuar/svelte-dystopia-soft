<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { checkboxVariants } from './Checkbox.variants.js';
	import type { CheckboxProps } from './Checkbox.types.js';

	let {
		size,
		class: className,
		classes,
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		disabled = false,
		invalid = false,
		...restProps
	}: CheckboxProps = $props();
</script>

<span
	class={cn(checkboxVariants({ size }), className)}
	data-disabled={disabled ? '' : undefined}
	data-invalid={invalid ? '' : undefined}
>
	<input
		type="checkbox"
		bind:this={ref}
		bind:checked
		bind:indeterminate
		{disabled}
		aria-invalid={invalid || undefined}
		class={cn(
			'peer absolute inset-0 size-full cursor-pointer appearance-none rounded-md border border-border bg-surface transition-colors duration-150 group-data-[invalid]:border-danger-border checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary hover:border-border-hover checked:hover:border-primary-hover checked:hover:bg-primary-hover indeterminate:hover:border-primary-hover indeterminate:hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group-data-[invalid]:focus-visible:ring-danger disabled:cursor-not-allowed',
			classes?.input
		)}
		{...restProps}
	/>

	<span
		aria-hidden="true"
		class={cn(
			'pointer-events-none absolute inset-0 flex items-center justify-center text-primary-foreground opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0',
			classes?.indicator
		)}
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m5 13 4 4 10-10" />
		</svg>
	</span>

	<span
		aria-hidden="true"
		class={cn(
			'pointer-events-none absolute inset-0 flex items-center justify-center text-primary-foreground opacity-0 peer-indeterminate:opacity-100',
			classes?.indicator
		)}
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
		>
			<path d="M6 12h12" />
		</svg>
	</span>
</span>
